import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";


import {
  InvoicePdfItem,
} from "@/types/invoicePdf";



const styles = StyleSheet.create({


  tableHeader: {

    flexDirection: "row",

    backgroundColor: "#2563eb",

    color: "white",

    paddingVertical: 8,

    fontWeight: "bold",

  },



  row: {

    flexDirection: "row",

    borderBottom: 1,

    borderBottomColor: "#e5e7eb",

    paddingVertical: 8,

  },



  desc: {

    width: "42%",

    paddingHorizontal: 6,

  },



  qty: {

    width: "12%",

    textAlign: "center",

  },



  unit: {

    width: "12%",

    textAlign: "center",

  },



  price: {

    width: "17%",

    textAlign: "right",

    paddingRight: 6,

  },



  total: {

    width: "17%",

    textAlign: "right",

    paddingRight: 6,

  },


});





interface Props {

  items: InvoicePdfItem[];

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






export default function InvoicePDFItems({

  items,

}:Props){


return (


<View>



<View style={styles.tableHeader}>


<Text style={styles.desc}>
Description
</Text>



<Text style={styles.qty}>
Qty
</Text>



<Text style={styles.unit}>
Unit
</Text>



<Text style={styles.price}>
Price
</Text>



<Text style={styles.total}>
Total
</Text>


</View>






{
items.map((item)=>(


<View

key={item.id}

style={styles.row}

>



<Text style={styles.desc}>

{item.description}

</Text>




<Text style={styles.qty}>

{item.quantity}

</Text>




<Text style={styles.unit}>

{item.unit}

</Text>





<Text style={styles.price}>

{currency(
  Number(item.unit_price)
)}

</Text>





<Text style={styles.total}>

{currency(
  Number(item.total)
)}

</Text>





</View>


))

}



</View>


);


}