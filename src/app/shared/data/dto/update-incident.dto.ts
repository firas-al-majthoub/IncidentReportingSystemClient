import { InvolvedEmployeeDto } from "./involved-employee.dto";

export interface UpdateIncidentDto {
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
}
