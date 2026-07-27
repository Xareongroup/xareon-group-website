import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 12,
    fontFamily: "Helvetica",
    backgroundColor: "#ffffff",
  },

  header: {
    marginBottom: 30,
    borderBottom: "2 solid #0B3D91",
    paddingBottom: 12,
  },

  company: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0B3D91",
    marginBottom: 4,
  },

  slogan: {
    fontSize: 10,
    color: "#666666",
    letterSpacing: 1,
    marginBottom: 20,
  },

  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#111827",
  },

  invoiceNumber: {
    marginTop: 8,
    fontSize: 16,
    color: "#4B5563",
  },
});

export default function InvoicePDF() {
  return (
    <Document>

      <Page size="LETTER" style={styles.page}>

        <View style={styles.header}>

          <Text style={styles.company}>
            XAREON GROUP
          </Text>

          <Text style={styles.slogan}>
            SHIELD OF INTEGRITY
          </Text>

          <Text style={styles.title}>
            INVOICE
          </Text>

          <Text style={styles.invoiceNumber}>
            INV-2026-00001
          </Text>

        </View>

        <Text>
          React PDF is working successfully.
        </Text>

      </Page>

    </Document>
  );
}