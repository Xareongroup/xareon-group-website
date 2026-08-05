import {
  Document,
  Page,
  StyleSheet,
} from "@react-pdf/renderer";


import {
  InvoicePdfData,
  InvoicePdfItem,
} from "@/types/invoicePdf";


import InvoicePDFHeader from "./InvoicePDFHeader";
import InvoicePDFCustomer from "./InvoicePDFCustomer";
import InvoicePDFItems from "./InvoicePDFItems";
import InvoicePDFTotals from "./InvoicePDFTotals";
import InvoicePDFFooter from "./InvoicePDFFooter";



const styles = StyleSheet.create({

  page: {

    padding: 40,

    fontSize: 11,

    fontFamily: "Helvetica",

    color: "#111827",

  },

});




interface Props {

  invoice: InvoicePdfData;

  items: InvoicePdfItem[];

}




export default function InvoicePDF({

  invoice,

  items,

}: Props) {


  return (

    <Document>


      <Page

        size="LETTER"

        style={styles.page}

      >



        <InvoicePDFHeader

          invoice={invoice}

        />



        <InvoicePDFCustomer

          invoice={invoice}

        />



        <InvoicePDFItems

          items={items}

        />



        <InvoicePDFTotals

          invoice={invoice}

        />



        <InvoicePDFFooter

          invoice={invoice}

        />



      </Page>


    </Document>

  );


}