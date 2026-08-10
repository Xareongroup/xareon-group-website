import { Text, View, StyleSheet } from "@react-pdf/renderer";
import DocumentPdfShell from "@/components/pdf/DocumentPdfShell";

const styles = StyleSheet.create({

  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 6,
  },

  customer: {
    marginBottom: 25,
  },

  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#2563eb",
    color: "white",
    paddingVertical: 8,
    fontWeight: "bold",
  },

  row: {
    flexDirection: "row",
    borderBottom: 1,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 8,
  },

  desc: {
    width: "42%",
    paddingHorizontal: 6,
  },

  qty: {
    width: "12%",
    textAlign: "center",
  },

  unit: {
    width: "12%",
    textAlign: "center",
  },

  price: {
    width: "17%",
    textAlign: "right",
    paddingRight: 6,
  },

  total: {
    width: "17%",
    textAlign: "right",
    paddingRight: 6,
  },

  totalsBox: {
    marginTop: 24,
    marginLeft: "55%",
    border: 1,
    borderColor: "#d1d5db",
    borderRadius: 6,
    padding: 12,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  grandTotal: {
    marginTop: 10,
    paddingTop: 10,
    borderTop: 1,
    borderTopColor: "#d1d5db",
    fontSize: 15,
    fontWeight: "bold",
    color: "#2563eb",
  },

});

function currency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value ?? 0);
}

interface EstimatePDFProps {
  estimate: any;
  customer: any;
  items: any[];
}

export default function EstimatePDF({
  estimate,
  customer,
  items,
}: EstimatePDFProps) {
  return (
    <DocumentPdfShell title="ESTIMATE" metadata={<><Text>Estimate #: {estimate.estimate_number}</Text><Text>Status: {estimate.status}</Text><Text>Issue: {estimate.issue_date ?? "-"}</Text><Text>Expires: {estimate.expiration_date ?? "-"}</Text></>}>

        <View style={styles.customer}>

          <Text style={styles.sectionTitle}>
            Prepared For
          </Text>

          <Text>
            {customer.first_name} {customer.last_name}
          </Text>

          <Text>{customer.email}</Text>

          <Text>{customer.phone}</Text>

          <Text>{customer.address}</Text>

        </View>

        <View style={styles.tableHeader}>

          <Text style={styles.desc}>
            Description
          </Text>

          <Text style={styles.qty}>
            Qty
          </Text>

          <Text style={styles.unit}>
            Unit
          </Text>

          <Text style={styles.price}>
            Price
          </Text>

          <Text style={styles.total}>
            Total
          </Text>

        </View>

        {items.map((item) => (

          <View
            key={item.id}
            style={styles.row}
          >

            <Text style={styles.desc}>
              {item.description}
            </Text>

            <Text style={styles.qty}>
              {item.quantity}
            </Text>

            <Text style={styles.unit}>
              {item.unit}
            </Text>

            <Text style={styles.price}>
              {currency(item.unit_price)}
            </Text>

            <Text style={styles.total}>
              {currency(item.total)}
            </Text>

          </View>

        ))}

        <View style={styles.totalsBox}>

          <View style={styles.totalRow}>
            <Text>Subtotal</Text>
            <Text>{currency(estimate.subtotal)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Tax</Text>
            <Text>{currency(estimate.tax)}</Text>
          </View>

          <View style={styles.totalRow}>
            <Text>Discount</Text>
            <Text>{currency(estimate.discount)}</Text>
          </View>

          <View
            style={[
              styles.totalRow,
              styles.grandTotal,
            ]}
          >
            <Text>Total</Text>
            <Text>{currency(estimate.total)}</Text>
          </View>

        </View>

    </DocumentPdfShell>
  );
}
