import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 20,
  },

  companySection: {
    flex: 1,
  },

  invoiceSection: {
    width: 180,
    alignItems: "flex-end",
  },

  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
    marginBottom: 4,
  },

  tagline: {
    fontSize: 10,
    color: "#64748B",
    marginBottom: 10,
  },

  companyInfo: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },

  invoiceTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },

  invoiceNumber: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1E3A8A",
  },

  status: {
    marginTop: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    backgroundColor: "#DBEAFE",
    color: "#1D4ED8",
    fontSize: 9,
  },
});

import { InvoicePdfData } from "@/types/invoicePdf";

interface Props {
  invoice: InvoicePdfData;
}

export default function InvoicePDFHeader({
  invoice,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.companySection}>

        <Text style={styles.companyName}>
          XAREON Group
        </Text>

        <Text style={styles.tagline}>
          Professional Home Repair & Installation Services
        </Text>

        <Text style={styles.companyInfo}>
          Serving the Greater DMV Metro Area
        </Text>

        <Text style={styles.companyInfo}>
          (202) 286-8497
        </Text>

        <Text style={styles.companyInfo}>
          info@xareongroup.com
        </Text>

      </View>

      <View style={styles.invoiceSection}>

        <Text style={styles.invoiceTitle}>
          INVOICE
        </Text>

        <Text style={styles.invoiceNumber}>
          {invoice.invoice_number}
        </Text>

        <Text style={styles.status}>
          {invoice.status}
        </Text>

      </View>

    </View>
  );
}