import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
  },

  thankYou: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    color: "#1E3A8A",
    marginBottom: 10,
  },

  termsTitle: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 6,
    color: "#0F172A",
  },

  terms: {
    fontSize: 9,
    color: "#475569",
    lineHeight: 1.5,
  },

  footer: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 8,
    color: "#94A3B8",
  },
});

import { InvoicePdfData } from "@/types/invoicePdf";

interface Props {
  invoice: InvoicePdfData;
}

export default function InvoicePDFFooter({
  invoice,
}: Props) {
  return (
    <View style={styles.container}>

      <Text style={styles.thankYou}>
        Thank you for choosing XAREON Group!
      </Text>

      <Text style={styles.termsTitle}>
        Payment Terms
      </Text>

      <Text style={styles.terms}>
        {invoice.notes ||
          `Payment is due within 30 days unless otherwise agreed.
Late payments may incur additional fees.
Please include the invoice number with your payment.
Thank you for your business.`}
      </Text>

      <Text style={styles.footer}>
        XAREON Group • Shield of Integrity
      </Text>

      <Text style={styles.footer}>
        www.xareongroup.com • info@xareongroup.com • (202) 286-8497
      </Text>

    </View>
  );
}