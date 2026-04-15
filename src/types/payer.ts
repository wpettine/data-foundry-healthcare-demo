export interface PayerCriteria {
  id: string;
  payerName: string;
  procedureType: string;
  criteria: PayerCriterionCell[];
}

export interface PayerCriterionCell {
  id: string;
  criterionName: string;
  requirement: string;
  status: 'met' | 'partial' | 'not-required';
}

export interface PayerDivergence {
  criterionName: string;
  diverging: boolean;
  details: string;
}
