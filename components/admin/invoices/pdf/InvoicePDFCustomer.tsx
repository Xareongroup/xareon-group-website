import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";

import {
  InvoicePdfData,
} from "@/types/invoicePdf";



const styles = StyleSheet.create({

  customer: {

    marginBottom: 25,

  },


  sectionTitle: {

    fontSize: 13,

    fontWeight: "bold",

    marginBottom: 6,

  },


  text: {

    fontSize: 11,

    marginBottom: 3,

  },


});




interface Props {

  invoice: InvoicePdfData;

}




export default function InvoicePDFCustomer({

  invoice,

}: Props) {


  return (

    <View style={styles.customer}>


      <Text style={styles.sectionTitle}>

        Bill To

      </Text>



      <Text style={styles.text}>

        {invoice.customers
          ? `${invoice.customers.first_name ?? ""} ${invoice.customers.last_name ?? ""}`.trim()
          : ""}

      </Text>



      {
        invoice.customers?.email && (

          <Text style={styles.text}>

            {invoice.customers.email}

          </Text>

        )
      }



      {
        invoice.customers?.phone && (

          <Text style={styles.text}>

            {invoice.customers.phone}

          </Text>

        )
      }




      {
        invoice.customers?.address && (

          <Text style={styles.text}>

            {invoice.customers.address}

          </Text>

        )
      }



    </View>

  );

}
