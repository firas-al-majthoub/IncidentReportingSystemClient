export interface IncidentSearchFilters {
  statusId: number | null;
  reportingDateFrom: string | null;
  reportingDateTo: string | null;
  lossTypeId: number | null;
  reporterDepartmentId: number | null;
  responsibleDepartmentId: number | null;
}
