import { Component } from '@angular/core';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { Incident } from '../../shared/data/model/incident';
import { IncidentsService } from '../../shared/services/incidents.service';
import { IncidentStatus } from '../../shared/data/model/incident-status';
import { IncidentStatusEnum } from '../../shared/data/enum/incident-status.enum';
import { SearchIncidentsResDto } from '../../shared/data/dto/search-incidents-res.dto';
import { SearchIncidentsOrderByEnum } from '../../shared/data/enum/search-incidents-order-by.enum';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { SearchIncidentsDto } from '../../shared/data/dto/search-incidents.dto';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import {
  SelectComponent,
  Option,
} from '../../shared/components/form/select/select.component';
import {
  DdlDataService,
  DdlItem,
} from '../../shared/services/ddl-data.service';
import { ToastsService } from '../../shared/services/toasts.service';
import { DatePickerComponent } from '../../shared/components/form/date-picker/date-picker.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { GeneratePdfFileDto } from '../../shared/data/dto/generate-pdf-file.dto';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-incidents',
  imports: [
    ComponentCardComponent,
    BadgeComponent,
    RouterLink,
    LabelComponent,
    SelectComponent,
    DatePickerComponent,
    ButtonComponent,
    DecimalPipe,
  ],
  templateUrl: './incidents.component.html',
})
export class IncidentsComponent {
  protected readonly SearchIncidentsOrderByEnum = SearchIncidentsOrderByEnum;
  protected readonly Number = Number;

  statuses: Option[] = [];
  lossTypes: Option[] = [];
  departments: Option[] = [];

  selectedStatus = '';
  reportingDateFrom: any;
  reportingDateTo: any;
  selectedLossType = '';
  selectedReporterDepartment = '';
  selectedResponsibleDepartment = '';

  incidents: Incident[] = [];
  itemsPerPage = '10';
  currentPage = 1;
  totalItemsCount = 0;
  totalPages = 1;
  orderBy = SearchIncidentsOrderByEnum.ReportingDate;
  orderingAsc = false;
  navigationPages: number[] = [];

  constructor(
    private incidentsService: IncidentsService,
    private authService: AuthService,
    public ddlDataService: DdlDataService,
    private toastsService: ToastsService,
  ) {
    this.getIncidents();
    this.getStatuses();
    this.getLossTypes();
    this.getDepartments();
  }

  filterIncidents(): void {
    this.currentPage = 1;
    this.orderBy = SearchIncidentsOrderByEnum.ReportingDate;
    this.orderingAsc = false;

    this.getIncidents();
  }

  private getIncidents() {
    const dto: SearchIncidentsDto = {
      itemsPerPage: Number.parseInt(this.itemsPerPage),
      currentPage: this.currentPage,
      orderBy: this.orderBy,
      orderAscending: this.orderingAsc,
      filters: {
        statusId: this.getSelectedStatus(),
        reportingDateFrom: this.getReportingDateFrom(),
        reportingDateTo: this.getReportingDateTo(),
        lossTypeId: this.getSelectedLossType(),
        reporterDepartmentId: this.getReporterDepartment(),
        responsibleDepartmentId: this.getResponsibleDepartment(),
      },
    };

    this.incidentsService.searchIncidents(dto).subscribe({
      next: (dto: SearchIncidentsResDto) => {
        this.incidents = dto.incidents;
        this.totalItemsCount = dto.totalItemsCount;
        this.totalPages = dto.totalPages;
        this.updateNavigationPages();
      },
    });
  }

  private getStatuses(): void {
    this.ddlDataService.getIncidentStatuses().subscribe({
      next: (deps: DdlItem[]) => {
        this.statuses = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

  private getLossTypes(): void {
    this.ddlDataService.getIncidentLossTypes().subscribe({
      next: (deps: DdlItem[]) => {
        this.lossTypes = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

  private getDepartments(): void {
    this.ddlDataService.getDepartments().subscribe({
      next: (deps: DdlItem[]) => {
        this.departments = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

  getSelectedStatus(): number | null {
    return this.getSelectedDdlVal(this.selectedStatus);
  }

  getReportingDateFrom(): string | null {
    return this.getSelectedDateVal(this.reportingDateFrom);
  }

  getReportingDateTo(): string | null {
    return this.getSelectedDateVal(this.reportingDateTo);
  }

  getSelectedLossType(): number | null {
    return this.getSelectedDdlVal(this.selectedLossType);
  }

  getReporterDepartment(): number | null {
    return this.getSelectedDdlVal(this.selectedReporterDepartment);
  }

  getResponsibleDepartment(): number | null {
    return this.getSelectedDdlVal(this.selectedResponsibleDepartment);
  }

  getSelectedDdlVal(val: string): number | null {
    return val != null && val != '' ? Number.parseInt(val) : null;
  }

  getSelectedDateVal(date: any): string | null {
    return date != null ? date.dateStr : null;
  }

  updateNavigationPages() {
    const temp: number[] = [];
    if (this.currentPage > 2) temp.push(this.currentPage - 1);

    if (this.currentPage > 1 && this.currentPage < this.totalPages)
      temp.push(this.currentPage);

    if (this.currentPage < this.totalPages - 1) temp.push(this.currentPage + 1);

    this.navigationPages = temp;
  }

  prevPage() {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getIncidents();
    }
  }

  sortBy(orderBy: SearchIncidentsOrderByEnum) {
    if (this.orderBy == orderBy) this.switchOrderDirection();
    else this.updateOrderBy(orderBy);
  }

  switchOrderDirection() {
    this.orderingAsc = !this.orderingAsc;
    this.getIncidents();
  }

  updateOrderBy(orderBy: SearchIncidentsOrderByEnum) {
    this.orderBy = orderBy;
    this.orderingAsc = false;
    this.getIncidents();
  }

  itemsPerPageChanged(event: Event) {
    this.itemsPerPage = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getIncidents();
  }

  private isManagerUser() {
    return this.authService.isManagerUser();
  }

  private isIncidentClosed(incident: Incident): boolean {
    return incident.status.id == IncidentStatusEnum.Closed;
  }

  private isIncidentUnderReview(incident: Incident): boolean {
    return incident.status.id == IncidentStatusEnum.UnderReview;
  }

  protected displayDownloadButton(): boolean {
    return this.isManagerUser();
  }

  protected displayEditButton(incident: Incident): boolean {
    return (
      !this.isIncidentClosed(incident) &&
      (this.isManagerUser() || this.viewerCanUpdateIncident(incident))
    );
  }

  private viewerCanUpdateIncident(incident: Incident) {
    return this.isIncidentUnderReview(incident);
  }

  protected downloadPdf(): void {
    const dto: GeneratePdfFileDto = {
      orderBy: this.orderBy,
      orderAscending: this.orderingAsc,
      filters: {
        statusId: this.getSelectedStatus(),
        reportingDateFrom: this.getReportingDateFrom(),
        reportingDateTo: this.getReportingDateTo(),
        lossTypeId: this.getSelectedLossType(),
        reporterDepartmentId: this.getReporterDepartment(),
        responsibleDepartmentId: this.getResponsibleDepartment(),
      },
    };

    this.incidentsService.generatePdfFile(dto).subscribe({
      next: (blob: Blob) => {
        // 1. Create a transient URL referencing the binary Blob data
        const binaryUrl = window.URL.createObjectURL(blob);

        // 2. Spawn a hidden DOM anchor markup element
        const downloadLink = document.createElement('a');
        downloadLink.href = binaryUrl;

        // 3. Define your explicit default file name extension
        downloadLink.download = 'incidents.pdf';

        // 4. Force browser event triggers to download files instantly
        downloadLink.click();

        // 5. Clean up browser RAM allocations once done
        window.URL.revokeObjectURL(binaryUrl);
        downloadLink.remove();
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

  getBadgeColor(status: IncidentStatus): 'success' | 'warning' | 'error' {
    if (status.id === IncidentStatusEnum.Closed) return 'success';
    if (status.id === IncidentStatusEnum.UnderReview) return 'error';
    return 'warning';
  }
}
