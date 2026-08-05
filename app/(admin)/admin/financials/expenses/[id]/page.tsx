import FinancialsClient from "@/components/admin/financials/FinancialsClient";
export default async function ExpensePage({params}:{params:Promise<{id:string}>}) { const {id}=await params; return <FinancialsClient view="expense-detail" expenseId={id} />; }
