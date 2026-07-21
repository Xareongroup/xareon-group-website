import { Estimate, EstimateItem } from "@/types/estimate";

export function calculateLineTotal(
  item: EstimateItem
): number {
  const quantity = Number(item.quantity) || 0;
  const unitPrice = Number(item.unitPrice) || 0;
  const discount = Number(item.discount) || 0;

  const total = quantity * unitPrice - discount;

  return Number(total.toFixed(2));
}

export function calculateSubtotal(
  items: EstimateItem[]
): number {
  return Number(
    items
      .reduce(
        (sum, item) => sum + calculateLineTotal(item),
        0
      )
      .toFixed(2)
  );
}

export function calculateTax(
  subtotal: number,
  taxRate: number
): number {
  return Number(
    ((subtotal * taxRate) / 100).toFixed(2)
  );
}

export function calculateGrandTotal(
  subtotal: number,
  tax: number,
  discount: number
): number {
  return Number(
    (subtotal + tax - discount).toFixed(2)
  );
}

export function recalculateEstimate(
  estimate: Estimate
): Estimate {
  const items = estimate.items.map((item) => ({
    ...item,
    total: calculateLineTotal(item),
  }));

  const subtotal = calculateSubtotal(items);

  const tax = calculateTax(
    subtotal,
    estimate.taxRate
  );

  const total = calculateGrandTotal(
    subtotal,
    tax,
    estimate.discount
  );

  return {
    ...estimate,
    items,
    subtotal,
    tax,
    total,
  };
}