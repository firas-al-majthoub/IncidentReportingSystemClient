export interface IncidentSearchFilters {
  statusId: number | null;
  reportingDateFrom: string | null;
  reportingDateTo: string | null;
  lossTypeId: number | null;
  severityId: number | null;
  departmentId: number | null;
}
