import "server-only";

export function getRequestMetadata(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  return { ipAddress: forwardedFor?.split(",")[0]?.trim() ?? request.headers.get("x-real-ip"), userAgent: request.headers.get("user-agent") };
}

export function isSignatureData(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("data:image/png;base64,") && value.length <= 1_500_000;
}
