import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";

export default function InventoryPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Inventory
          </h1>

          <p className="text-slate-600">
            Manage tools, parts and materials.
          </p>
        </div>

        <Button>
          Add Item
        </Button>
      </div>

      <Card title="Inventory Overview">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-xl border p-5">
            <p className="text-sm text-slate-500">
              Total Items
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-slate-500">
              Low Stock
            </p>

            <p className="mt-2 text-3xl font-bold text-red-600">
              0
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-slate-500">
              Categories
            </p>

            <p className="mt-2 text-3xl font-bold">
              0
            </p>
          </div>

          <div className="rounded-xl border p-5">
            <p className="text-sm text-slate-500">
              Inventory Value
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              $0.00
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}