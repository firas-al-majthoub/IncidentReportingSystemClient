import { Incident } from '../model/incident';

export interface AllIncidentsDto {
  incidents: Incident[];
  totalItemsCount: number;
  totalPages: number;
}
