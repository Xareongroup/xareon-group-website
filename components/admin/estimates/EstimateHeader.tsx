"use client";

import { Estimate, EstimateStatus } from "@/types/estimate";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

interface EstimateHeaderProps {
  estimate: Estimate;
  setEstimate: React.Dispatch<React.SetStateAction<Estimate>>;
  customers: Customer[];
}

const statuses: EstimateStatus[] = [
  "Draft",
  "Sent",
  "Viewed",
  "Approved",
  "Rejected",
  "Expired",
  "Converted",
];

export default function EstimateHeader({
  estimate,
  setEstimate,
  customers,
}: EstimateHeaderProps) {
  function update<K extends keyof Estimate>(
    key: K,
    value: Estimate[K]
  ) {
    setEstimate((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  return (
    <div className="rounded-xl bg-white p-6 shadow">

      <h2 className="mb-6 text-2xl font-bold">
        Estimate Information
      </h2>

      <div className="grid gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium">
            Estimate #
          </label>

          <input
            value={
              estimate.estimateNumber || "Auto Generated"
            }
            readOnly
            className="w-full rounded-lg border bg-slate-100 p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Status
          </label>

          <select
            value={estimate.status}
            onChange={(e) =>
              update(
                "status",
                e.target.value as EstimateStatus
              )
            }
            className="w-full rounded-lg border p-3"
          >
            {statuses.map((status) => (
              <option
                key={status}
                value={status}
              >
                {status}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Customer
          </label>

          <select
            value={estimate.customerId}
            onChange={(e) =>
              update("customerId", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          >
            <option value="">
              Select Customer...
            </option>

            {customers.map((customer) => (
              <option
                key={customer.id}
                value={customer.id}
              >
                {customer.first_name}{" "}
                {customer.last_name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Issue Date
          </label>

          <input
            type="date"
            value={estimate.issueDate}
            onChange={(e) =>
              update("issueDate", e.target.value)
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Expiration Date
          </label>

          <input
            type="date"
            value={estimate.expirationDate}
            onChange={(e) =>
              update(
                "expirationDate",
                e.target.value
              )
            }
            className="w-full rounded-lg border p-3"
          />
        </div>

      </div>

    </div>
  );
}