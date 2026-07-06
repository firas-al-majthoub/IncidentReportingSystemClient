import { UpdateIncidentDto } from './update-incident.dto';

export interface CloseIncidentDto extends UpdateIncidentDto {
  resolutionNotes: string;
}
