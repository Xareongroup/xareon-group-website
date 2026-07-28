export type SignatureStatus =
  | "pending"
  | "signed"
  | "declined";

export interface Signature {
  id: string;

  documentType:
    | "estimate"
    | "contract"
    | "work-order"
    | "completion";

  documentId: string;

  signerName: string;

  signerEmail: string;

  signedAt?: string;

  signatureImage?: string;

  ipAddress?: string;

  status: SignatureStatus;

  createdAt?: string;
}