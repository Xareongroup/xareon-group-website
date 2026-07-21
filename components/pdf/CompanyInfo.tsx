import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface CompanyInfoProps {
  customer: any;
  title?: string;
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    padding: 12,
    marginBottom: 24,
  },

  heading: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#1f2937",
  },

  line: {
    fontSize: 11,
    marginBottom: 3,
    color: "#374151",
  },
});

export default function CompanyInfo({
  customer,
  title = "Bill To",
}: CompanyInfoProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>{title}</Text>

      <Text style={styles.line}>
        {customer
          ? `${customer.first_name} ${customer.last_name}`
          : "Unknown Customer"}
      </Text>

      {customer?.email && (
        <Text style={styles.line}>{customer.email}</Text>
      )}

      {customer?.phone && (
        <Text style={styles.line}>{customer.phone}</Text>
      )}

      {customer?.address && (
        <Text style={styles.line}>{customer.address}</Text>
      )}
    </View>
  );
}