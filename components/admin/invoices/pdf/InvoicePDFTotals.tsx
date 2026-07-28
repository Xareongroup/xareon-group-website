import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    alignItems: "flex-end",
  },

  box: {
    width: 230,
    borderWidth: 1,
    borderColor: "#CBD5E1",
    padding: 12,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  label: {
    fontSize: 10,
    color: "#475569",
  },

  value: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#0F172A",
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    paddingTop: 10,
    marginTop: 8,
  },

  grandTotal: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#0F172A",
  },

  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
  },

  balanceLabel: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1D4ED8",
  },

  balanceValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1D4ED8",
  },
});

import { InvoicePdfData } from "@/types/invoicePdf";

interface Props {
  invoice: InvoicePdfData;
}

export default function InvoicePDFTotals({
  invoice,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.box}>

        <View style={styles.row}>
          <Text style={styles.label}>
            Subtotal
          </Text>

          <Text style={styles.value}>
            ${Number(invoice.subtotal).toFixed(2)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Tax
          </Text>

          <Text style={styles.value}>
            ${Number(invoice.tax).toFixed(2)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Discount
          </Text>

          <Text style={styles.value}>
            $0.00
          </Text>
        </View>

        <View style={styles.totalRow}>
          <Text style={styles.grandTotal}>
            Total
          </Text>

          <Text style={styles.grandTotal}>
            ${Number(invoice.total).toFixed(2)}
          </Text>
        </View>

        <View style={styles.balanceRow}>
          <Text style={styles.balanceLabel}>
            Balance Due
          </Text>

          <Text style={styles.balanceValue}>
            ${Number(invoice.balance_due).toFixed(2)}
          </Text>
        </View>

      </View>

    </View>
  );
}