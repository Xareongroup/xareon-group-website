import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";


const logoPath =
  `${process.cwd()}/public/logo/xareon1-logo.png`;



const styles = StyleSheet.create({

  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#111827",
  },


  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#CBD5E1",
    paddingBottom: 18,
    marginBottom: 25,
  },


  logo: {
    width: 90,
    height: 90,
    marginBottom: 8,
  },


  companySection: {
    width: "55%",
  },


  contractSection: {
    width: "40%",
    alignItems: "flex-end",
  },


  companyName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1E3A8A",
  },


  tagline: {
    marginTop: 4,
    fontSize: 10,
    color: "#64748B",
  },


  companyText: {
    fontSize: 9,
    color: "#475569",
    marginTop: 3,
  },


  contractTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2563EB",
    marginBottom: 12,
  },


  infoText: {
    fontSize: 10,
    marginBottom: 5,
  },


  section: {
    marginBottom: 18,
  },


  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#0F172A",
  },


  box: {
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 6,
    padding: 12,
  },


  text: {
    lineHeight: 1.5,
    color: "#334155",
  },


  customerRow: {
    marginBottom: 5,
  },


  signatureBox: {
    marginTop: 25,
    borderTopWidth: 1,
    borderTopColor: "#CBD5E1",
    paddingTop: 18,
  },


  signatureImage: {
    width: 180,
    height: 70,
    marginTop: 10,
  },


  footer: {
    marginTop: 35,
    textAlign: "center",
    fontSize: 9,
    color: "#64748B",
  },

});




interface Props {

  contract: any;

  customer: any;

}





function formatDate(
  value: string | null
) {

  if (!value) {
    return "-";
  }


  return new Date(value)
    .toLocaleDateString();

}





export default function ContractPDF({

  contract,

  customer,

}: Props) {


  return (

    <Document>


      <Page
        size="LETTER"
        style={styles.page}
      >



        {/* HEADER */}

        <View style={styles.header}>


          <View style={styles.companySection}>


            <Image
              src={logoPath}
              style={styles.logo}
            />



            <Text style={styles.companyName}>
              XAREON GROUP
            </Text>


            <Text style={styles.tagline}>
              Shield of Integrity
            </Text>


            <Text style={styles.companyText}>
              Professional Home Repair & Installation Services
            </Text>


            <Text style={styles.companyText}>
              Greater DMV Metro Area
            </Text>


            <Text style={styles.companyText}>
              (202) 286-8497
            </Text>


            <Text style={styles.companyText}>
              info@xareongroup.com
            </Text>


            <Text style={styles.companyText}>
              www.xareongroup.com
            </Text>


          </View>





          <View style={styles.contractSection}>


            <Text style={styles.contractTitle}>
              SERVICE CONTRACT
            </Text>


            <Text style={styles.infoText}>
              Contract #: {contract.contract_number ?? "-"}
            </Text>


            <Text style={styles.infoText}>
              Status: {contract.status}
            </Text>


            <Text style={styles.infoText}>
              Issue Date: {formatDate(contract.issue_date)}
            </Text>


          </View>



        </View>








        {/* CUSTOMER */}


        <View style={styles.section}>


          <Text style={styles.sectionTitle}>
            Customer Information
          </Text>


          <View style={styles.box}>


            <Text style={styles.customerRow}>
              {customer?.first_name} {customer?.last_name}
            </Text>


            <Text style={styles.customerRow}>
              {customer?.email}
            </Text>


            <Text style={styles.customerRow}>
              {customer?.phone}
            </Text>


            <Text>
              {customer?.address}
            </Text>


          </View>


        </View>








        {/* SCOPE OF WORK */}


        <View style={styles.section}>


          <Text style={styles.sectionTitle}>
            1. Scope of Work
          </Text>


          <View style={styles.box}>


            <Text style={styles.text}>
              {
                contract.scope_of_work ??
                contract.terms ??
                "No scope of work provided."
              }
            </Text>


          </View>


        </View>









        {/* PAYMENT TERMS */}


        <View style={styles.section}>


          <Text style={styles.sectionTitle}>
            2. Payment Terms
          </Text>


          <View style={styles.box}>


            <Text style={styles.text}>
              {
                contract.payment_terms ??
                contract.terms ??
                "No payment terms provided."
              }
            </Text>


          </View>


        </View>









        {/* WARRANTY */}


        <View style={styles.section}>


          <Text style={styles.sectionTitle}>
            3. Warranty
          </Text>


          <View style={styles.box}>


            <Text style={styles.text}>
              {
                contract.warranty ??
                "No warranty information provided."
              }
            </Text>


          </View>


        </View>









        {/* NOTES */}


        <View style={styles.section}>


          <Text style={styles.sectionTitle}>
            4. Additional Notes
          </Text>


          <View style={styles.box}>


            <Text style={styles.text}>
              {
                contract.notes ??
                "No additional notes."
              }
            </Text>


          </View>


        </View>









        {/* SIGNATURE */}


        <View style={styles.signatureBox}>


          <Text style={styles.sectionTitle}>
            Customer Approval
          </Text>



          <Text>
            Signed By: {contract.signed_by_name ?? "Pending"}
          </Text>



          <Text>
            Signed Date: {formatDate(contract.signed_at)}
          </Text>





          {
            contract.signed_signature && (

              <Image
                src={contract.signed_signature}
                style={styles.signatureImage}
              />

            )
          }



        </View>









        {/* FOOTER */}


        <View style={styles.footer}>


          <Text>
            This service contract was prepared by XAREON GROUP.
          </Text>


          <Text>
            Shield of Integrity | www.xareongroup.com | info@xareongroup.com
          </Text>


        </View>




      </Page>


    </Document>

  );


}