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
import { GenerateReportFileDto } from '../../shared/data/dto/generate-pdf-file.dto';
import { DecimalPipe } from '@angular/common';
import { SystemScreensEnum } from '../../shared/data/enum/system-screens.enum';
import { SystemPrivilegesEnum } from '../../shared/data/enum/system-privileges.enum';
import { UsersService } from '../../shared/services/users.service';

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

  private userHasEditIncidentPrivilege = false;
  private userHasUpdateIncidentPrivilege = false;
  private userHasCloseIncidentPrivilege = false;
  private userHasReturnIncidentPrivilege = false;
  private userHasSearchPrivilege = false;
  private userHasIncidentDetailsPrivilege = false;

  constructor(
    private incidentsService: IncidentsService,
    private ddlDataService: DdlDataService,
    private toastsService: ToastsService,
    private usersService: UsersService,
  ) {
    this.getActionsPrivileges();
    this.getIncidents();
    this.getStatuses();
    this.getLossTypes();
    this.getDepartments();
  }

  private getActionsPrivileges(): void {
    this.getEditIncidentPrivilege();
    this.getUpdateIncidentPrivilege();
    this.getCloseIncidentPrivilege();
    this.getReturnIncidentPrivilege();
    this.getSearchPrivilege();
    this.getIncidentDetailsPrivilege();
  }

  private getEditIncidentPrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.EditIncident,
        SystemPrivilegesEnum.Read,
      )
      .subscribe({
        next: () => {
          this.userHasEditIncidentPrivilege = true;
        },
      });
  }

  private getUpdateIncidentPrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.EditIncident,
        SystemPrivilegesEnum.Update,
      )
      .subscribe({
        next: () => {
          this.userHasUpdateIncidentPrivilege = true;
        },
      });
  }

  private getCloseIncidentPrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.EditIncident,
        SystemPrivilegesEnum.CloseIncident,
      )
      .subscribe({
        next: () => {
          this.userHasCloseIncidentPrivilege = true;
        },
      });
  }

  private getReturnIncidentPrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.EditIncident,
        SystemPrivilegesEnum.ReturnIncident,
      )
      .subscribe({
        next: () => {
          this.userHasReturnIncidentPrivilege = true;
        },
      });
  }

  private getSearchPrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.ViewAllIncidents,
        SystemPrivilegesEnum.Search,
      )
      .subscribe({
        next: () => {
          this.userHasSearchPrivilege = true;
        },
      });
  }

  private getIncidentDetailsPrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.IncidentDetails,
        SystemPrivilegesEnum.Read,
      )
      .subscribe({
        next: () => {
          this.userHasIncidentDetailsPrivilege = true;
        },
      });
  }

  protected filterIncidents(): void {
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

  private getSelectedStatus(): number | null {
    return this.getSelectedDdlVal(this.selectedStatus);
  }

  private getReportingDateFrom(): string | null {
    return this.getSelectedDateVal(this.reportingDateFrom);
  }

  private getReportingDateTo(): string | null {
    return this.getSelectedDateVal(this.reportingDateTo);
  }

  private getSelectedLossType(): number | null {
    return this.getSelectedDdlVal(this.selectedLossType);
  }

  private getReporterDepartment(): number | null {
    return this.getSelectedDdlVal(this.selectedReporterDepartment);
  }

  private getResponsibleDepartment(): number | null {
    return this.getSelectedDdlVal(this.selectedResponsibleDepartment);
  }

  private getSelectedDdlVal(val: string): number | null {
    return val != null && val != '' ? Number.parseInt(val) : null;
  }

  private getSelectedDateVal(date: any): string | null {
    return date != null ? date.dateStr : null;
  }

  private updateNavigationPages() {
    const temp: number[] = [];
    if (this.currentPage > 2) temp.push(this.currentPage - 1);

    if (this.currentPage > 1 && this.currentPage < this.totalPages)
      temp.push(this.currentPage);

    if (this.currentPage < this.totalPages - 1) temp.push(this.currentPage + 1);

    this.navigationPages = temp;
  }

  protected prevPage() {
    if (this.currentPage > 1) this.goToPage(this.currentPage - 1);
  }

  protected nextPage() {
    if (this.currentPage < this.totalPages) this.goToPage(this.currentPage + 1);
  }

  protected goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.getIncidents();
    }
  }

  protected sortBy(orderBy: SearchIncidentsOrderByEnum) {
    if (this.orderBy == orderBy) this.switchOrderDirection();
    else this.updateOrderBy(orderBy);
  }

  protected switchOrderDirection() {
    this.orderingAsc = !this.orderingAsc;
    this.getIncidents();
  }

  private updateOrderBy(orderBy: SearchIncidentsOrderByEnum) {
    this.orderBy = orderBy;
    this.orderingAsc = false;
    this.getIncidents();
  }

  protected itemsPerPageChanged(event: Event) {
    this.itemsPerPage = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getIncidents();
  }

  private isIncidentClosed(incident: Incident): boolean {
    return incident.status.id == IncidentStatusEnum.Closed;
  }

  private isIncidentUnderReview(incident: Incident): boolean {
    return incident.status.id == IncidentStatusEnum.UnderReview;
  }

  protected get showIncidentDetailsBtn(): boolean {
    return this.userHasIncidentDetailsPrivilege;
  }

  protected showEditButton(incident: Incident): boolean {
    return (
      this.userHasEditIncidentPrivilege &&
      ((this.userHasUpdateIncidentPrivilege &&
        this.isIncidentUnderReview(incident)) ||
        (this.userHasCloseIncidentPrivilege &&
          !this.isIncidentClosed(incident)) ||
        (this.userHasReturnIncidentPrivilege &&
          this.isIncidentUnderReview(incident)))
    );
  }

  protected get showSearchTable(): boolean {
    return this.userHasSearchPrivilege;
  }

  protected downloadPdf(): void {
    const dto: GenerateReportFileDto = {
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

  protected downloadExcel() {
    const dto: GenerateReportFileDto = {
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

    this.incidentsService.generateExcelFile(dto).subscribe({
      next: (blob: Blob) => {
        // 1. Create a transient URL referencing the binary Blob data
        const binaryUrl = window.URL.createObjectURL(blob);

        // 2. Spawn a hidden DOM anchor markup element
        const downloadLink = document.createElement('a');
        downloadLink.href = binaryUrl;

        // 3. Define your explicit default file name extension
        downloadLink.download = 'incidents.xlsx';

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

  protected getBadgeColor(
    status: IncidentStatus,
  ): 'success' | 'warning' | 'error' {
    if (status.id === IncidentStatusEnum.Closed) return 'success';
    if (status.id === IncidentStatusEnum.UnderReview) return 'error';
    return 'warning';
  }
}
