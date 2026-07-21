import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

import CompanyHeader from "./CompanyHeader";
import CompanyInfo from "./CompanyInfo";
import TotalsCard from "./TotalsCard";
import CompanyFooter from "./CompanyFooter";

interface InvoicePDFProps {
  invoice: any;
  customer: any;
  items: any[];
}

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
  },

  header: {
  flexDirection: "row",
  justifyContent: "flex-end",
  marginBottom: 25,
},

  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "right",
    marginBottom: 10,
  },

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
    <Document>
      <Page size="A4" style={styles.page}>

        <CompanyHeader />

<View style={styles.header}>

  <View />

  <View>
    <Text style={styles.invoiceTitle}>
      INVOICE
    </Text>

    <Text>
      Invoice #: {invoice.invoice_number}
    </Text>

    <Text>
      Status: {invoice.status}
    </Text>

    <Text>
      Issue Date:{" "}
      {invoice.issued_at
        ? new Date(invoice.issued_at).toLocaleDateString()
        : "-"}
    </Text>

  </View>

</View>

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
<CompanyFooter />
      </Page>
    </Document>
  );
}