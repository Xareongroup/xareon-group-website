import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  rpc: vi.fn(),
  from: vi.fn(),
  upload: vi.fn(),
  remove: vi.fn(),
  send: vi.fn(),
  triggerAutomation: vi.fn(),
}));

vi.mock("@/lib/supabase/admin", () => ({
  adminSupabase: {
    rpc: mocks.rpc,
    from: mocks.from,
    storage: { from: () => ({ upload: mocks.upload, remove: mocks.remove }) },
  },
}));
vi.mock("@/lib/resend", () => ({ resend: { emails: { send: mocks.send } } }));
vi.mock("@/lib/automation/automationEngine", () => ({ triggerAutomation: mocks.triggerAutomation }));

import { POST } from "@/app/api/contact/route";
import { ESTIMATE_UPLOAD_LIMITS } from "@/lib/estimate-request";

function validFormData() {
  const form = new FormData();
  form.set("name", "  Pat Customer  ");
  form.set("email", " PAT@example.com ");
  form.set("phone", "(301) 555-0199");
  form.set("service", "General Home Repairs");
  form.set("propertyType", "Residential");
  form.set("city", " Rockville ");
  form.set("description", "Please repair two damaged interior doors in my home.");
  form.set("turnstileToken", "valid_token_123");
  return form;
}

function requestFor(form: FormData) {
  return { headers: new Headers({ "content-type": "multipart/form-data; boundary=test" }), formData: vi.fn().mockResolvedValue(form) } as unknown as Request;
}

function jpeg(name = "project.jpg", size = 3) {
  const bytes = new Uint8Array(Math.max(size, 3));
  bytes.set([0xff, 0xd8, 0xff]);
  return testFile(bytes, name, "image/jpeg");
}

function testFile(content: BlobPart, name: string, type: string) {
  const file = new File([content], name, { type });
  const bytes = content instanceof Uint8Array ? content : new TextEncoder().encode(String(content));
  Object.defineProperty(file, "arrayBuffer", { value: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength) });
  return file;
}

describe("public contact API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.TURNSTILE_SECRET_KEY = "turnstile-secret";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-role";
    process.env.RESEND_API_KEY = "resend-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ json: vi.fn().mockResolvedValue({ success: true }) }));
    mocks.rpc.mockResolvedValue({ data: "LEAD-100", error: null });
    mocks.upload.mockResolvedValue({ error: null });
    mocks.remove.mockResolvedValue({ error: null });
    mocks.send.mockResolvedValue({ data: { id: "email-1" }, error: null });
    mocks.triggerAutomation.mockResolvedValue(undefined);
    mocks.from.mockImplementation((table: string) => table === "leads"
      ? { insert: vi.fn(() => ({ select: vi.fn(() => ({ single: vi.fn().mockResolvedValue({ data: { id: "lead-1", lead_number: "LEAD-100" }, error: null }) })) })) }
      : { insert: vi.fn().mockResolvedValue({ error: null }) });
  });

  it("accepts a valid submission and preserves the successful response contract", async () => {
    const response = await POST(requestFor(validFormData()));
    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ success: true, leadNumber: "LEAD-100", message: "Estimate request submitted successfully." });
    expect(mocks.triggerAutomation).toHaveBeenCalledOnce();
  });

  it.each([
    ["missing name", "name", "", "Full name is required."],
    ["malformed email", "email", "not-an-email", "Please enter a valid email address."],
    ["malformed phone", "phone", "call-me", "Please enter a valid phone number."],
    ["unsupported service", "service", "Roof Replacement", "Please select an approved service."],
    ["oversized field", "description", "x".repeat(5_001), "Project description is too long."],
  ])("rejects %s", async (_label, field, value, message) => {
    const form = validFormData();
    form.set(field, value);
    const response = await POST(requestFor(form));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ success: false, error: message });
    expect(mocks.rpc).not.toHaveBeenCalled();
  });

  it("rejects unexpected and repeated scalar fields with a safe response", async () => {
    const form = validFormData();
    form.append("email", "other@example.com");
    form.set("internalRole", "admin");
    const response = await POST(requestFor(form));
    expect(response.status).toBe(400);
    const body = await response.json();
    expect(body).toEqual({ success: false, error: "The request contains unexpected fields." });
    expect(JSON.stringify(body)).not.toMatch(/stack|supabase|token/i);
  });

  it("rejects malformed request bodies and excessive declared request sizes safely", async () => {
    const malformed = { headers: new Headers({ "content-type": "multipart/form-data; boundary=test" }), formData: vi.fn().mockRejectedValue(new Error("parser internals")) } as unknown as Request;
    let response = await POST(malformed);
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ success: false, error: "The form submission could not be read." });

    const tooLarge = requestFor(validFormData());
    tooLarge.headers.set("content-length", String(ESTIMATE_UPLOAD_LIMITS.maxRequestBytes + 1));
    response = await POST(tooLarge);
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({ success: false, error: "The request is too large." });
  });

  it("rejects too many files", async () => {
    const form = validFormData();
    for (let index = 0; index <= ESTIMATE_UPLOAD_LIMITS.maxFiles; index += 1) form.append("photos", jpeg(`photo-${index}.jpg`));
    const response = await POST(requestFor(form));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ success: false, error: "Upload no more than 10 photos." });
  });

  it("rejects an oversized file", async () => {
    const form = validFormData();
    form.append("photos", jpeg("large.jpg", ESTIMATE_UPLOAD_LIMITS.maxFileBytes + 1));
    const response = await POST(requestFor(form));
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({ success: false, error: "Each image must be 4 MB or smaller." });
  });

  it("rejects files whose combined size exceeds the upload limit", async () => {
    const form = validFormData();
    form.append("photos", jpeg("one.jpg", 3 * 1024 * 1024));
    form.append("photos", jpeg("two.jpg", 2 * 1024 * 1024));
    const response = await POST(requestFor(form));
    expect(response.status).toBe(413);
    await expect(response.json()).resolves.toEqual({ success: false, error: "Combined image uploads must be 4 MB or smaller." });
  });

  it("rejects invalid MIME types and mismatched image signatures", async () => {
    const unsupported = validFormData();
    unsupported.append("photos", testFile("plain text", "note.txt", "text/plain"));
    let response = await POST(requestFor(unsupported));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ success: false, error: "Only JPG, PNG, and WEBP images are accepted." });

    const mismatch = validFormData();
    mismatch.append("photos", testFile("not jpeg", "fake.jpg", "image/jpeg"));
    response = await POST(requestFor(mismatch));
    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({ success: false, error: "An uploaded image does not match its declared file type." });
  });

  it("escapes script-like customer input in notification HTML and uses safe generated storage names", async () => {
    const form = validFormData();
    form.set("name", "<b>Pat Customer</b>");
    form.set("description", "Please inspect <script>alert('x')</script> and repair the damaged wall.");
    form.append("photos", jpeg("../../<img onerror=x>.jpg"));
    const response = await POST(requestFor(form));
    expect(response.status).toBe(200);
    const email = mocks.send.mock.calls[0][0];
    expect(email.html).toContain("&lt;script&gt;alert(&#39;x&#39;)&lt;/script&gt;");
    expect(email.html).not.toContain("<script>");
    expect(email.attachments[0].filename).not.toMatch(/[\\/]/);
    expect(mocks.upload.mock.calls[0][0]).toMatch(/^website\/[0-9a-f-]+\.jpg$/);
  });

  it("returns a safe generic error when downstream processing throws", async () => {
    mocks.rpc.mockRejectedValue(new Error("database password secret"));
    const response = await POST(requestFor(validFormData()));
    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toEqual({ success: false, error: "Internal server error." });
  });
});
