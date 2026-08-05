import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";


const styles = StyleSheet.create({

  page:{
    padding:40,
    fontSize:11,
    fontFamily:"Helvetica",
    color:"#111827",
  },


  header:{
    borderBottomWidth:1,
    borderBottomColor:"#CBD5E1",
    paddingBottom:15,
    marginBottom:25,
  },


  title:{
    fontSize:28,
    fontWeight:"bold",
    color:"#2563EB",
    marginBottom:10,
  },


  section:{
    marginBottom:20,
  },


  heading:{
    fontSize:13,
    fontWeight:"bold",
    marginBottom:8,
  },


  text:{
    lineHeight:1.5,
  },


  footer:{
    marginTop:40,
    textAlign:"center",
    fontSize:10,
    color:"#64748B",
  },

});



interface Props {

  contract:any;

  customer:any;

}



export default function SignedContractPDF({

  contract,

  customer,

}:Props){


return (

<Document>


<Page
 size="LETTER"
 style={styles.page}
>


<View style={styles.header}>

<Text style={styles.title}>
SIGNED SERVICE CONTRACT
</Text>


<Text>
XAREON GROUP
</Text>


<Text>
Shield of Integrity
</Text>


<Text>
Professional Home Repair & Installation Services
</Text>


</View>




<View style={styles.section}>

<Text style={styles.heading}>
Customer
</Text>


<Text>
{customer?.first_name} {customer?.last_name}
</Text>


<Text>
{customer?.email}
</Text>


<Text>
{customer?.phone}
</Text>


</View>





<View style={styles.section}>

<Text style={styles.heading}>
Scope of Work
</Text>


<Text style={styles.text}>
{contract.scope_of_work ??
"No scope provided."}
</Text>


</View>






<View style={styles.section}>

<Text style={styles.heading}>
Payment Terms
</Text>


<Text style={styles.text}>
{contract.payment_terms ??
"No payment terms provided."}
</Text>


</View>







<View style={styles.section}>

<Text style={styles.heading}>
Customer Signature
</Text>


<Text>
Signed By:
{" "}
{contract.signed_by_name ?? "Pending"}
</Text>


<Text>
Signed Date:
{" "}
{contract.signed_at ?? "Pending"}
</Text>


</View>






<View style={styles.footer}>

<Text>
XAREON GROUP • Shield of Integrity
</Text>


<Text>
www.xareongroup.com
</Text>


</View>



</Page>


</Document>

);


}