export interface ReportIncidentDto {
  discoverDate: string;
  incidentDate: string;
  description: string;
  hasFinancialImpact: boolean;
  financialImpactAmount: number | null;
  recoveredFinancialLoss: boolean;
  recoveryAmount: number | null;
  recoveryDate: string | null;
  involvedEmployees: string[];
  relatedProcedure: string;
  correctiveAction: string;
  phone: string | null;
  email: string | null;
}
