import {
  View,
 Text,
  StyleSheet,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#CBD5E1",
  },

  header: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingVertical: 8,
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    paddingVertical: 8,
    alignItems: "center",
  },

  description: {
    flex: 3,
    paddingHorizontal: 8,
    fontSize: 10,
  },

  qty: {
    width: 50,
    textAlign: "center",
    fontSize: 10,
  },

  unit: {
    width: 60,
    textAlign: "center",
    fontSize: 10,
  },

  price: {
    width: 80,
    textAlign: "right",
    paddingRight: 8,
    fontSize: 10,
  },

  discount: {
    width: 80,
    textAlign: "right",
    paddingRight: 8,
    fontSize: 10,
  },

  total: {
    width: 90,
    textAlign: "right",
    paddingRight: 8,
    fontSize: 10,
    fontWeight: "bold",
  },

  headerText: {
    fontSize: 10,
    fontWeight: "bold",
  },
});

import { InvoicePdfItem } from "@/types/invoicePdf";

interface Props {
  items: InvoicePdfItem[];
}

export default function InvoicePDFItems({
  items,
}: Props) {
  return (
    <View style={styles.table}>

      <View style={styles.header}>

        <Text style={[styles.description, styles.headerText]}>
          Description
        </Text>

        <Text style={[styles.qty, styles.headerText]}>
          Qty
        </Text>

        <Text style={[styles.unit, styles.headerText]}>
          Unit
        </Text>

        <Text style={[styles.price, styles.headerText]}>
          Price
        </Text>

        <Text style={[styles.discount, styles.headerText]}>
          Discount
        </Text>

        <Text style={[styles.total, styles.headerText]}>
          Total
        </Text>

      </View>

      {items.map((item) => (
        <View
          key={item.id}
          style={styles.row}
        >

          <Text style={styles.description}>
            {item.description}
          </Text>

          <Text style={styles.qty}>
            {item.quantity}
          </Text>

          <Text style={styles.unit}>
            {item.unit}
          </Text>

          <Text style={styles.price}>
            ${Number(item.unit_price).toFixed(2)}
          </Text>

          <Text style={styles.discount}>
            ${Number(item.discount).toFixed(2)}
          </Text>

          <Text style={styles.total}>
            ${Number(item.total).toFixed(2)}
          </Text>

        </View>
      ))}

    </View>
  );
}