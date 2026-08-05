export function checkInvoiceOverdue(
  dueDate: string | null,
  status: string
) {

  if (!dueDate) {
    return false;
  }


  if (
    status === "Paid"
  ) {
    return false;
  }


  const today =
    new Date();


  const due =
    new Date(dueDate);



  return today > due;

}