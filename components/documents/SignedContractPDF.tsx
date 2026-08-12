import { StyleSheet, Text, View } from "@react-pdf/renderer";

import DocumentPdfShell from "@/components/pdf/DocumentPdfShell";

const styles = StyleSheet.create({
  section: { marginBottom: 20 },
  heading: { fontSize: 13, fontWeight: "bold", marginBottom: 8 },
  text: { lineHeight: 1.5 },
  footer: { marginTop: 40, textAlign: "center", fontSize: 10, color: "#64748B" },
});

interface Props { contract: any; customer: any; }

export default function SignedContractPDF({ contract, customer }: Props) {
  return <DocumentPdfShell title="SIGNED SERVICE CONTRACT" metadata={<><Text>Contract #: {contract.contract_number ?? "Pending"}</Text><Text>Status: Signed</Text><Text>Signed: {contract.signed_at ?? "Pending"}</Text></>}><View style={styles.section}><Text style={styles.heading}>Customer</Text><Text>{customer?.first_name} {customer?.last_name}</Text><Text>{customer?.email}</Text><Text>{customer?.phone}</Text></View><View style={styles.section}><Text style={styles.heading}>Terms and Conditions</Text><Text style={styles.text}>{contract.terms ?? "No terms provided."}</Text></View><View style={styles.section}><Text style={styles.heading}>Additional Notes</Text><Text style={styles.text}>{contract.notes ?? "No additional notes provided."}</Text></View><View style={styles.section}><Text style={styles.heading}>Customer Signature</Text><Text>Signed By: {contract.signed_by_name ?? "Pending"}</Text><Text>Signed Date: {contract.signed_at ?? "Pending"}</Text></View><View style={styles.footer}><Text>This signed contract confirms customer approval.</Text><Text>Thank you for choosing XAREON GROUP.</Text></View></DocumentPdfShell>;
}
