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
  patientId: string; // References Patient.id - each cell can have a different patient
}

export interface PayerDivergence {
  criterionName: string;
  diverging: boolean;
  details: string;
}
