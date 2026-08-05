import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";


import {
  InvoicePdfData,
} from "@/types/invoicePdf";



const styles = StyleSheet.create({


  footer: {

    marginTop: 40,

    textAlign: "center",

    fontSize: 10,

    color: "#6b7280",

  },


  thankYou: {

    fontSize: 11,

    color: "#2563eb",

    fontWeight: "bold",

    marginBottom: 6,

  },


  termsTitle: {

    marginTop: 18,

    fontSize: 10,

    fontWeight: "bold",

    color: "#111827",

  },


  terms: {

    marginTop: 6,

    fontSize: 9,

    color: "#6b7280",

    lineHeight: 1.5,

  },


});





interface Props {

  invoice: InvoicePdfData;

}





export default function InvoicePDFFooter({

  invoice,

}:Props){


return (


<View>



<View style={styles.footer}>


<Text style={styles.thankYou}>

Thank you for choosing XAREON GROUP.

</Text>


<Text>

We appreciate your business.

</Text>


</View>





<View>


<Text style={styles.termsTitle}>

Payment Terms

</Text>



<Text style={styles.terms}>

{
invoice.notes ||

`Payment is due within 30 days unless otherwise agreed.
Please include the invoice number with your payment.
Thank you for your business.`
}

</Text>


</View>





<View style={styles.footer}>


<Text>

XAREON GROUP • Shield of Integrity

</Text>


<Text>

www.xareongroup.com • info@xareongroup.com • (202) 286-8497

</Text>


</View>



</View>


);


}