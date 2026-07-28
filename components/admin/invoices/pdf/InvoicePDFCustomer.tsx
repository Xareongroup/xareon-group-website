import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  left: {
    flex: 1,
    paddingRight: 30,
  },

  right: {
    width: 220,
  },

  heading: {
    fontSize: 11,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0F172A",
  },

  text: {
    fontSize: 10,
    marginBottom: 4,
    color: "#475569",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  label: {
    color: "#64748B",
  },

  value: {
    fontWeight: "bold",
    color: "#0F172A",
  },
});

import { InvoicePdfData } from "@/types/invoicePdf";

interface Props {
  invoice: InvoicePdfData;
}

export default function InvoicePDFCustomer({
  invoice,
}: Props) {
  return (
    <View style={styles.container}>

      <View style={styles.left}>

        <Text style={styles.heading}>
          Bill To
        </Text>

        <Text style={styles.text}>
          {invoice.customers?.name ?? ""}
        </Text>

        {invoice.customers?.email && (
          <Text style={styles.text}>
            {invoice.customers.email}
          </Text>
        )}

        {invoice.customers?.phone && (
          <Text style={styles.text}>
            {invoice.customers.phone}
          </Text>
        )}

      </View>

      <View style={styles.right}>

        <Text style={styles.heading}>
          Invoice Details
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>
            Issue Date
          </Text>

          <Text style={styles.value}>
            {invoice.issue_date}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Due Date
          </Text>

          <Text style={styles.value}>
            {invoice.due_date}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Status
          </Text>

          <Text style={styles.value}>
            {invoice.status}
          </Text>
        </View>

        {invoice.estimate_id && (
          <View style={styles.row}>
            <Text style={styles.label}>
              Estimate
            </Text>

            <Text style={styles.value}>
              {invoice.estimate_id}
            </Text>
          </View>
        )}

        {invoice.job_id && (
          <View style={styles.row}>
            <Text style={styles.label}>
              Job
            </Text>

            <Text style={styles.value}>
              {invoice.job_id}
            </Text>
          </View>
        )}

      </View>

    </View>
  );
}