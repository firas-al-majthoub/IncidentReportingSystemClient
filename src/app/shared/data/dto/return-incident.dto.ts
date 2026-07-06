import { UpdateIncidentDto } from './update-incident.dto';

export interface ReturnIncidentDto extends UpdateIncidentDto {
  returnNotes: string;
}
