import { InvolvedEmployeeDto } from "./involved-employee.dto";

export interface CloseIncidentDto {
  id: number;
  discoverDate: string;
  incidentDate: string;
  description: string;
  hasFinancialImpact: boolean;
  financialImpactAmount: number | null;
  recoveredFinancialLoss: boolean;
  recoveryAmount: number | null;
  recoveryDate: string | null;
  involvedEmployees: InvolvedEmployeeDto[];
  relatedProcedure: string;
  correctiveAction: string;
  phone: string | null;
  email: string | null;
  lossTypeId: number;
  causeId: number;
  reporterDepartmentId: number;
  responsibleDepartmentId: number;
  resolutionNotes: string;
}
