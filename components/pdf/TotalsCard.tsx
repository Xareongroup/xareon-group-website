import { View, Text, StyleSheet } from "@react-pdf/renderer";

interface TotalsCardProps {
  subtotal: number;
  tax: number;
  total: number;
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginLeft: "55%",
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 4,
    padding: 12,
  },

  heading: {
    fontSize: 12,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f2937",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    fontSize: 11,
  },

  divider: {
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    marginVertical: 8,
  },

  total: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 14,
    fontWeight: "bold",
    color: "#111827",
  },
});

const money = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);

export default function TotalsCard({
  subtotal,
  tax,
  total,
}: TotalsCardProps) {
  return (
    <View style={styles.container}>

      <Text style={styles.heading}>TOTALS</Text>

      <View style={styles.row}>
        <Text>Subtotal</Text>
        <Text>{money(subtotal)}</Text>
      </View>

      <View style={styles.row}>
        <Text>Tax</Text>
        <Text>{money(tax)}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.total}>
        <Text>Total</Text>
        <Text>{money(total)}</Text>
      </View>

    </View>
  );
}