import { SearchIncidentsOrderByEnum } from '../enum/search-incidents-order-by.enum';
import { IncidentSearchFilters } from './incident-search-filters';

export interface GeneratePdfFileDto {
  orderBy: SearchIncidentsOrderByEnum;
  orderAscending: boolean;
  filters: IncidentSearchFilters;
}
