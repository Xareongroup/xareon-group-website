import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

import {
  InvoicePdfData,
} from "@/types/invoicePdf";


const styles = StyleSheet.create({

  header: {

    flexDirection: "row",

    justifyContent: "space-between",

    borderBottom: 1,

    borderBottomColor: "#d1d5db",

    paddingBottom: 16,

    marginBottom: 24,

  },


  company: {

    width: "55%",

  },


  title: {

    width: "40%",

    textAlign: "right",

  },


  companyName: {

    fontSize: 24,

    fontWeight: "bold",

    marginBottom: 6,

  },


  invoiceTitle: {

    fontSize: 30,

    color: "#2563eb",

    fontWeight: "bold",

    marginBottom: 12,

  },


  info: {

    fontSize: 11,

    marginBottom: 2,

  },


  status: {

    marginTop: 6,

  },


});



interface Props {

  invoice: InvoicePdfData;

}



export default function InvoicePDFHeader({

  invoice,

}: Props) {


  return (

    <View style={styles.header}>


      <View style={styles.company}>


        <Text style={styles.companyName}>

          XAREON GROUP

        </Text>


        <Text>

          Shield of Integrity

        </Text>


        <Text>

          Professional Home Repair &

          Installation Services

        </Text>


        <Text>

          Greater DMV Metro Area

        </Text>


        <Text>

          (202) 286-8497

        </Text>


        <Text>

          info@xareongroup.com

        </Text>


        <Text>

          www.xareongroup.com

        </Text>


      </View>





      <View style={styles.title}>


        <Text style={styles.invoiceTitle}>

          INVOICE

        </Text>



        <Text>

          Invoice #:

          {" "}

          {invoice.invoice_number}

        </Text>



        <Text>

          Status:

          {" "}

          {invoice.status}

        </Text>



        <Text>

          Issue:

          {" "}

          {invoice.issue_date ?? "-"}

        </Text>



        <Text>

          Due:

          {" "}

          {invoice.due_date ?? "-"}

        </Text>


      </View>



    </View>

  );

}