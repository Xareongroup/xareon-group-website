import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import CompanyFooter from "./CompanyFooter";
import CompanyHeader from "./CompanyHeader";
import CompanyInfo from "./CompanyInfo";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica" },
  heading: { alignItems: "flex-end", marginBottom: 25 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  card: { marginTop: 24, borderWidth: 1, borderColor: "#e2e8f0", padding: 16 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 9 },
  total: { fontSize: 16, fontWeight: "bold", marginTop: 8 },
});

const money = (amount: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);

interface PaymentReceiptPDFProps {
  payment: { id: string; amount: number; payment_date: string; payment_method: string; reference_number: string | null };
  invoice: { invoice_number: string | null; total: number | null; amount_paid: number | null; balance_due: number | null };
  customer: { first_name: string | null; last_name: string | null; email: string | null; phone: string | null; address: string | null };
}

export default function PaymentReceiptPDF({ payment, invoice, customer }: PaymentReceiptPDFProps) {
  return <Document><Page size="A4" style={styles.page}>
    <CompanyHeader />
    <View style={styles.heading}><Text style={styles.title}>PAYMENT RECEIPT</Text><Text>Receipt: {payment.id}</Text><Text>Invoice: {invoice.invoice_number ?? "—"}</Text><Text>Date: {new Date(payment.payment_date).toLocaleDateString()}</Text></View>
    <CompanyInfo customer={customer} />
    <View style={styles.card}>
      <View style={styles.row}><Text>Payment method</Text><Text>{payment.payment_method}</Text></View>
      {payment.reference_number && <View style={styles.row}><Text>Reference</Text><Text>{payment.reference_number}</Text></View>}
      <View style={styles.row}><Text>Total paid on invoice</Text><Text>{money(Number(invoice.amount_paid ?? 0))}</Text></View>
      <View style={styles.row}><Text>Remaining balance</Text><Text>{money(Number(invoice.balance_due ?? 0))}</Text></View>
      <View style={[styles.row, styles.total]}><Text>Payment received</Text><Text>{money(Number(payment.amount))}</Text></View>
    </View>
    <CompanyFooter />
  </Page></Document>;
}
