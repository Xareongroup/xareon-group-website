"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";

import { Estimate } from "@/types/estimate";
import { defaultEstimate } from "@/lib/estimates/defaults";
import { recalculateEstimate } from "@/lib/estimates/calculations";

import EstimateHeader from "@/components/admin/estimates/EstimateHeader";
import EstimateItems from "@/components/admin/estimates/EstimateItems";
import EstimateTotals from "@/components/admin/estimates/EstimateTotals";
import EstimateNotes from "@/components/admin/estimates/EstimateNotes";
import EstimateTerms from "@/components/admin/estimates/EstimateTerms";
import EstimateSummary from "@/components/admin/estimates/EstimateSummary";
import EstimateActions from "@/components/admin/estimates/EstimateActions";

interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

export default function NewEstimatePage() {
  const router = useRouter();
  const supabase = createClient();

  const [estimate, setEstimate] =
    useState<Estimate>(defaultEstimate);

  const [customers, setCustomers] =
    useState<Customer[]>([]);

  const [loadingCustomers, setLoadingCustomers] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    void loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoadingCustomers(true);
    setError(null);

    const { data, error } = await supabase
      .from("customers")
      .select("id, first_name, last_name")
      .order("first_name");

    if (error) {
      setError(error.message);
      setLoadingCustomers(false);
      return;
    }

    setCustomers(data ?? []);
    setLoadingCustomers(false);
  }

  async function saveEstimate() {
    setError(null);

    if (!estimate.customerId) {
      setError("Please select a customer.");
      return;
    }

    if (estimate.items.length === 0) {
      setError("Please add at least one line item.");
      return;
    }

    if (
      estimate.items.some(
        (item) => item.description.trim() === ""
      )
    ) {
      setError(
        "Every line item must have a description."
      );
      return;
    }

    setSaving(true);

    try {
      const calculated =
        recalculateEstimate(estimate);

      const {
        data: estimateRecord,
        error: estimateError,
      } = await supabase
        .from("estimates")
        .insert({
          customer_id: calculated.customerId,
          status: calculated.status,
          issue_date: calculated.issueDate,
          expiration_date:
            calculated.expirationDate,
          subtotal: calculated.subtotal,
          tax_rate: calculated.taxRate,
          tax: calculated.tax,
          discount: calculated.discount,
          total: calculated.total,
          notes: calculated.notes,
          terms: calculated.terms,
        })
        .select("id")
        .single();

      if (estimateError) {
        throw estimateError;
      }
    
            const estimateId = estimateRecord.id;

      const items = calculated.items.map(
        (item, index) => ({
          estimate_id: estimateId,
          description: item.description,
          quantity: item.quantity,
          unit: item.unit,
          unit_price: item.unitPrice,
          discount: item.discount,
          taxable: item.taxable,
          total: item.total,
          sort_order: index + 1,
        })
      );

      if (items.length > 0) {
        const { error: itemError } =
          await supabase
            .from("estimate_items")
            .insert(items);

        if (itemError) {
          throw itemError;
        }
      }

      router.push("/admin/estimates");
      router.refresh();

    } catch (err) {

      const message =
        err instanceof Error
          ? err.message
          : "Unable to save estimate.";

      setError(message);

    } finally {

      setSaving(false);

    }
  }

  function cancelEstimate() {
    router.push("/admin/estimates");
  }

  function previewEstimate() {
    alert("PDF preview coming soon.");
  }

  function emailEstimate() {
    alert("Email feature coming soon.");
  }

  const selectedCustomer = customers.find(
    (customer) => customer.id === estimate.customerId
  );

  const customerName = selectedCustomer
    ? `${selectedCustomer.first_name} ${selectedCustomer.last_name}`
    : "";

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">

      {/* ====================================================== */}
      {/* Page Header */}
      {/* ====================================================== */}

      <div className="mb-8 flex items-end justify-between border-b border-slate-200 pb-6">

        <div>

          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            New Estimate
          </h1>

          <p className="mt-2 text-base text-slate-500">
            Create a professional estimate for your customer.
          </p>

        </div>

      </div>

      {loadingCustomers && (

        <div className="mb-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-blue-700">

          Loading customers...

        </div>

      )}

      {error && (

        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700">

          {error}

        </div>

      )}

            {/* ====================================================== */}
      {/* Main Workspace */}
      {/* ====================================================== */}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,2fr)_380px]">

        {/* ====================================================== */}
        {/* Estimate Editor */}
        {/* ====================================================== */}

        <div className="space-y-6">

          <EstimateHeader
            estimate={estimate}
            setEstimate={setEstimate}
            customers={customers}
          />

          <EstimateItems
            estimate={estimate}
            setEstimate={setEstimate}
          />

          <EstimateTotals
            estimate={estimate}
            setEstimate={setEstimate}
          />

          <EstimateNotes
            estimate={estimate}
            setEstimate={setEstimate}
          />

          <EstimateTerms
            estimate={estimate}
            setEstimate={setEstimate}
          />

        </div>

        {/* ====================================================== */}
        {/* Summary Sidebar */}
        {/* ====================================================== */}

        <div className="space-y-6 xl:sticky xl:top-6 xl:self-start">

          <EstimateSummary
            estimate={estimate}
            customerName={customerName}
          />

          <EstimateActions
            estimate={estimate}
            loading={saving}
            onSave={saveEstimate}
            onCancel={cancelEstimate}
            onPreview={previewEstimate}
            onEmail={emailEstimate}
          />

        </div>

      </div>

    </div>
  );
}