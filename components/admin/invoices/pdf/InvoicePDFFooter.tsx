import { StyleSheet, Text, View } from "@react-pdf/renderer";
import type { InvoicePdfData } from "@/types/invoicePdf";

const styles = StyleSheet.create({
  termsTitle: { marginTop: 18, fontSize: 10, fontWeight: "bold", color: "#111827" },
  terms: { marginTop: 6, fontSize: 9, color: "#6b7280", lineHeight: 1.5 },
});

export default function InvoicePDFFooter({ invoice }: { invoice: InvoicePdfData }) {
  return <View><Text style={styles.termsTitle}>Payment Terms</Text><Text style={styles.terms}>{invoice.notes || "Payment is due within 30 days unless otherwise agreed. Please include the invoice number with your payment."}</Text></View>;
}
