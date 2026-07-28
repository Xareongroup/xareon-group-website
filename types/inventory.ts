export interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  description?: string;

  quantity: number;
  minimumQuantity: number;

  unitCost: number;
  sellPrice: number;

  location?: string;

  active: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface JobMaterial {
  id: string;

  jobId: string;

  inventoryId: string;

  quantity: number;

  unitCost: number;
}