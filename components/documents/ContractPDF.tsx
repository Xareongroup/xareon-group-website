import { Image, StyleSheet, Text, View } from "@react-pdf/renderer";

import DocumentPdfShell from "@/components/pdf/DocumentPdfShell";

const styles = StyleSheet.create({
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 13, fontWeight: "bold", marginBottom: 8, color: "#0f172a" },
  box: { borderWidth: 1, borderColor: "#cbd5e1", borderRadius: 6, padding: 12 },
  text: { lineHeight: 1.5, color: "#334155" },
  customerRow: { marginBottom: 5 },
  signatureBox: { marginTop: 25, borderTopWidth: 1, borderTopColor: "#cbd5e1", paddingTop: 18 },
  signatureImage: { width: 180, height: 70, marginTop: 10 },
});

function formatDate(value: string | null | undefined) {
  return value ? new Date(value).toLocaleDateString() : "-";
}

export default function ContractPDF({ contract, customer }: { contract: any; customer: any }) {
  return (
    <DocumentPdfShell title="SERVICE CONTRACT" metadata={<><Text>Contract #: {contract.contract_number ?? "-"}</Text><Text>Status: {contract.status ?? "Draft"}</Text><Text>Issue date: {formatDate(contract.issue_date)}</Text></>}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Customer Information</Text>
        <View style={styles.box}>
          <Text style={styles.customerRow}>{customer?.first_name} {customer?.last_name}</Text>
          <Text style={styles.customerRow}>{customer?.email}</Text>
          <Text style={styles.customerRow}>{customer?.phone}</Text>
          <Text>{customer?.address}</Text>
        </View>
      </View>
      <Section title="1. Scope of Work" value={contract.scope_of_work ?? contract.terms ?? "No scope of work provided."} />
      <Section title="2. Payment Terms" value={contract.payment_terms ?? contract.terms ?? "No payment terms provided."} />
      <Section title="3. Warranty" value={contract.warranty ?? "No warranty information provided."} />
      <Section title="4. Additional Notes" value={contract.notes ?? "No additional notes."} />
      <View style={styles.signatureBox}>
        <Text style={styles.sectionTitle}>Customer Approval</Text>
        <Text>Signed by: {contract.signed_by_name ?? "Pending"}</Text>
        <Text>Signed date: {formatDate(contract.signed_at)}</Text>
        {contract.signed_signature && <Image src={contract.signed_signature} style={styles.signatureImage} />}
      </View>
    </DocumentPdfShell>
  );
}

function Section({ title, value }: { title: string; value: string }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text><View style={styles.box}><Text style={styles.text}>{value}</Text></View></View>;
}
