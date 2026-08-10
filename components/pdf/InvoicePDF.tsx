import { Text, View, StyleSheet } from "@react-pdf/renderer";

import CompanyInfo from "./CompanyInfo";
import TotalsCard from "./TotalsCard";
import DocumentPdfShell from "./DocumentPdfShell";

interface InvoicePDFProps {
  invoice: any;
  customer: any;
  items: any[];
}

const styles = StyleSheet.create({
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    paddingBottom: 6,
    marginBottom: 6,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    paddingVertical: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },

  description: {
    width: "40%",
  },

  qty: {
    width: "10%",
    textAlign: "center",
  },

  unit: {
    width: "10%",
    textAlign: "center",
  },

  price: {
    width: "15%",
    textAlign: "right",
  },

  total: {
    width: "25%",
    textAlign: "right",
  },

});

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);

export default function InvoicePDF({
  invoice,
  customer,
  items,
}: InvoicePDFProps) {
  return (
    <DocumentPdfShell title="INVOICE" metadata={<><Text>Invoice #: {invoice.invoice_number}</Text><Text>Status: {invoice.status}</Text><Text>Issue date: {invoice.issue_date ? new Date(invoice.issue_date).toLocaleDateString() : "-"}</Text></>}>

        <CompanyInfo customer={customer} />

        <View style={styles.tableHeader}>
          <Text style={styles.description}>Description</Text>
          <Text style={styles.qty}>Qty</Text>
          <Text style={styles.unit}>Unit</Text>
          <Text style={styles.price}>Price</Text>
          <Text style={styles.total}>Total</Text>
        </View>

        {items.map((item: any) => (
          <View key={item.id} style={styles.row}>
            <Text style={styles.description}>{item.description}</Text>
            <Text style={styles.qty}>{item.quantity}</Text>
            <Text style={styles.unit}>{item.unit}</Text>
            <Text style={styles.price}>{money(item.unit_price)}</Text>
            <Text style={styles.total}>{money(item.total)}</Text>
          </View>
        ))}

<TotalsCard
  subtotal={invoice.subtotal}
  tax={invoice.tax}
  total={invoice.total}
/>
    </DocumentPdfShell>
  );
}
