import { Department } from './department';
import { IncidentCause } from './incident-cause';
import { IncidentLossType } from './incident-loss-type';
import { IncidentSeverity } from './incident-severity';
import { IncidentStatus } from './incident-status';
import { User } from './user';

export interface Incident {
  id: number;
  description: string;
  department: Department;
  lossType: IncidentLossType;
  cause: IncidentCause;
  severity: IncidentSeverity;
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
  reportingDate: string;
  status: IncidentStatus;
  reportedBy: User;
}
