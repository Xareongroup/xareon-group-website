import { View, Text, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#d1d5db",
    alignItems: "center",
  },

  thankYou: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1d4ed8",
    marginBottom: 6,
  },

  contact: {
    fontSize: 9,
    color: "#4b5563",
    marginBottom: 2,
  },

  copyright: {
    marginTop: 8,
    fontSize: 8,
    color: "#9ca3af",
  },
});

export default function CompanyFooter() {
  return (
    <View style={styles.container}>
      <Text style={styles.thankYou}>
        Thank you for choosing XAREON Group.
      </Text>

      <Text style={styles.contact}>
        Professional Home Repair & Installation Services
      </Text>

      <Text style={styles.contact}>
        www.xareongroup.com
      </Text>

      <Text style={styles.contact}>
        info@xareongroup.com
      </Text>

      <Text style={styles.contact}>
        (202) 286-8497
      </Text>

      <Text style={styles.copyright}>
        © {new Date().getFullYear()} XAREON Group. All Rights Reserved.
      </Text>
    </View>
  );
}