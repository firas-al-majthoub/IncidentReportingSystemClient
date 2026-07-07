import { InvolvedEmployeeDto } from './involved-employee.dto';

export interface UpdateIncidentDto {
  id: number;
  riskDescription: string;
  involvedEmployees: InvolvedEmployeeDto[];
  relatedProcedure: string;
  correctiveAction: string;
  phone: string | null;
  email: string | null;
  lossTypeId: number;
  causeId: number;
  reporterDepartmentId: number;
  responsibleDepartmentId: number;
  riskCategoryFirstLevelId: number | null;
  riskCategorySecondLevelId: number | null;
}
