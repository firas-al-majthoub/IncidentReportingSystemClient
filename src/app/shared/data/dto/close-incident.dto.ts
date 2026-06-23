export interface CloseIncidentDto {
  id: number;
  description: string;
  departmentId: number;
  lossTypeId: number;
  causeId: number;
  severityId: number;
  discoverDate: string;
  incidentDate: string;
  expectedResolvingDate: string;
  hasFinancialImpact: boolean;
  financialImpactAmount: number | null;
  involvedEmployees: string;
  relatedProcedure: string;
  latestUpdates: string;
  correctiveAction: string;
  recovery: string | null;
  recoveryDate: string | null;
  phone: string | null;
  email: string | null;
  resolutionNotes: string;
}
