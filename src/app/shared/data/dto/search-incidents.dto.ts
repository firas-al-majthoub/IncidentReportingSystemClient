import { SearchIncidentsOrderByEnum } from '../enum/search-incidents-order-by.enum';

export interface SearcIincidentsDto {
  itemsPerPage: number;
  currentPage: number;
  orderBy: SearchIncidentsOrderByEnum;
  orderAscending: boolean;
  filters: IncidentSearchFilters;
}

export interface IncidentSearchFilters {
  statusId: number | null;
  reportingDateFrom: string | null;
  reportingDateTo: string | null;
  lossTypeId: number | null;
  severityId: number | null;
  departmentId: number | null;
}
