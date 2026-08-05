import {
  pdf,
} from "@react-pdf/renderer";

import SignedEstimatePDF from "./SignedEstimatePDF";


export async function generateSignedEstimatePDF(
  estimate:any,
  customer:any,
  items:any[]
) {

  const buffer =
    await pdf(
      <SignedEstimatePDF
        estimate={estimate}
        customer={customer}
        items={items}
      />
    ).toBuffer();


  return buffer;

}