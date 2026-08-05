import FinancialsClient from "@/components/admin/financials/FinancialsClient";
export default async function EditExpensePage({params}:{params:Promise<{id:string}>}) { const {id}=await params; return <FinancialsClient view="expense-form" expenseId={id} />; }
