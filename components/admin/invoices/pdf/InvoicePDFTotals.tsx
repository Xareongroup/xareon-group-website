import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";


import {
  InvoicePdfData,
} from "@/types/invoicePdf";



const styles = StyleSheet.create({


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



  label: {

    fontSize: 11,

  },



  value: {

    fontSize: 11,

    fontWeight: "bold",

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


  balance: {

    marginTop: 10,

    paddingTop: 10,

    borderTop: 1,

    borderTopColor: "#d1d5db",

    fontSize: 12,

    fontWeight: "bold",

    color: "#2563eb",

  },


});





interface Props {

  invoice: InvoicePdfData;

}





function currency(value:number){

  return new Intl.NumberFormat(
    "en-US",
    {
      style:"currency",
      currency:"USD",
    }
  ).format(value ?? 0);

}







export default function InvoicePDFTotals({

  invoice,

}:Props){


return (


<View style={styles.totalsBox}>




<View style={styles.totalRow}>

<Text style={styles.label}>
Subtotal
</Text>


<Text style={styles.value}>
{currency(invoice.subtotal)}
</Text>

</View>






<View style={styles.totalRow}>

<Text style={styles.label}>
Tax
</Text>


<Text style={styles.value}>
{currency(invoice.tax)}
</Text>

</View>






<View style={styles.totalRow}>

<Text style={styles.label}>
Discount
</Text>


<Text style={styles.value}>
$0.00
</Text>

</View>







<View style={[
  styles.totalRow,
  styles.grandTotal,
]}>



<Text>
Total
</Text>


<Text>
{currency(invoice.total)}
</Text>



</View>







<View style={[
  styles.totalRow,
  styles.balance,
]}>



<Text>
Balance Due
</Text>


<Text>
{currency(invoice.balance_due)}
</Text>



</View>






</View>


);


}