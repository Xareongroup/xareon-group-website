import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 2,
    borderBottomColor: "#1d4ed8",
    paddingBottom: 18,
    marginBottom: 24,
    alignItems: "center",
  },

  logo: {
    width: 120,
    height: 120,
    objectFit: "contain",
    marginBottom: 10,
  },

  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#0f172a",
    textAlign: "center",
    letterSpacing: 1,
  },

  slogan: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2563eb",
    textAlign: "center",
    marginTop: 2,
    marginBottom: 10,
    letterSpacing: 0.8,
  },

  description: {
    fontSize: 10,
    color: "#374151",
    textAlign: "center",
    marginBottom: 8,
  },

  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
    marginBottom: 6,
  },

  contact: {
    fontSize: 9,
    color: "#4b5563",
  },

  separator: {
    fontSize: 9,
    color: "#9ca3af",
  },

  serviceArea: {
    fontSize: 9,
    color: "#6b7280",
    textAlign: "center",
  },
});

export default function CompanyHeader() {
  return (
    <View style={styles.container}>
      <Image
        src="https://www.xareongroup.com/logo/xareon1-logo.png"
        style={styles.logo}
      />

      <Text style={styles.companyName}>
        XAREON GROUP
      </Text>

      <Text style={styles.slogan}>
        SHIELD OF INTEGRITY
      </Text>

      <Text style={styles.description}>
        Professional Home Repair & Installation Services
      </Text>

      <View style={styles.contactRow}>
        <Text style={styles.contact}>
          (202) 286-8497
        </Text>

        <Text style={styles.separator}>•</Text>

        <Text style={styles.contact}>
          info@xareongroup.com
        </Text>

        <Text style={styles.separator}>•</Text>

        <Text style={styles.contact}>
          www.xareongroup.com
        </Text>
      </View>

      <Text style={styles.serviceArea}>
        Serving the Greater DMV Metro Area
      </Text>
    </View>
  );
}