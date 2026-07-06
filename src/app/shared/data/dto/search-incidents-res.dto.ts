import { Incident } from '../model/incident';

export interface SearchIncidentsResDto {
  incidents: Incident[];
  totalItemsCount: number;
  totalPages: number;
}
