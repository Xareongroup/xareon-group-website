import { renderToBuffer } from "@react-pdf/renderer";
import EstimatePDF from "@/components/admin/estimates/EstimatePDF";

interface RenderEstimatePdfOptions {
  estimate: any;
  customer: any;
  items: any[];
}

export async function renderEstimatePdf({
  estimate,
  customer,
  items,
}: RenderEstimatePdfOptions) {
  return await renderToBuffer(
    <EstimatePDF
      estimate={estimate}
      customer={customer}
      items={items}
    />
  );
}