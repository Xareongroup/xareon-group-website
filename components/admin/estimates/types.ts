import { Estimate } from "@/types/estimate";

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
}

export interface EstimateComponentProps {
  estimate: Estimate;
  setEstimate: React.Dispatch<React.SetStateAction<Estimate>>;
}

export interface EstimateHeaderProps
  extends EstimateComponentProps {
  customers: Customer[];
}

export interface EstimateSummaryProps {
  estimate: Estimate;
}