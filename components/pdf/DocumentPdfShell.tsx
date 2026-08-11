import type { ReactNode } from "react";
import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

import CompanyFooter from "./CompanyFooter";
import CompanyHeader from "./CompanyHeader";

const styles = StyleSheet.create({
  page: { padding: 40, fontSize: 11, fontFamily: "Helvetica", color: "#111827" },
  documentTitle: { flexDirection: "row", justifyContent: "flex-end", marginBottom: 24 },
  documentTitlePanel: { minWidth: 200, borderWidth: 1, borderColor: "#bfdbfe", backgroundColor: "#eff6ff", borderRadius: 8, padding: 12 },
  title: { fontSize: 22, fontWeight: "bold", color: "#1d4ed8", textAlign: "right", letterSpacing: 1.5, marginBottom: 8 },
  metadata: { fontSize: 10, color: "#334155", lineHeight: 1.45 },
});

export function DocumentTitleBlock({ title, children }: { title: string; children?: ReactNode }) {
  return <View style={styles.documentTitle}><View style={styles.documentTitlePanel}><Text style={styles.title}>{title}</Text><View style={styles.metadata}>{children}</View></View></View>;
}

export default function DocumentPdfShell({ title, metadata, children }: { title: string; metadata?: ReactNode; children: ReactNode }) {
  return <Document><Page size="LETTER" style={styles.page}><CompanyHeader /><DocumentTitleBlock title={title}>{metadata}</DocumentTitleBlock>{children}<CompanyFooter /></Page></Document>;
}
