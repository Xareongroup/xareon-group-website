import {
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";


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


  documentTitle: {

    fontSize: 30,

    color: "#2563eb",

    fontWeight: "bold",

    marginBottom: 12,

  },


});


interface Props {

  title: string;

  details: {

    label: string;

    value: string | number | null;

  }[];

}



export default function XareonDocumentHeader({

  title,

  details,

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

          Professional Home Repair & Installation Services

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


        <Text style={styles.documentTitle}>

          {title}

        </Text>


        {
          details.map((item, index) => (

            <Text key={index}>

              {item.label}: {item.value ?? "-"}

            </Text>

          ))
        }


      </View>



    </View>

  );

}