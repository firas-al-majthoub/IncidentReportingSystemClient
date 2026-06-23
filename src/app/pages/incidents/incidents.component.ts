import { Component } from '@angular/core';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { Incident } from '../../shared/data/model/incident';
import { IncidentsService } from '../../shared/services/incidents.service';
import { IncidentStatus } from '../../shared/data/model/incident-status';
import { IncidentStatusEnum } from '../../shared/data/enum/incident-status.enum';
import { AllIncidentsDto } from '../../shared/data/dto/all-incidents.dto';
import { SearchIncidentsOrderByEnum } from '../../shared/data/enum/search-incidents-order-by.enum';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-incidents',
  imports: [ComponentCardComponent, BadgeComponent, RouterLink],
  templateUrl: './incidents.component.html',
})
export class IncidentsComponent {
  protected readonly IncidentStatusEnum = IncidentStatusEnum;
  protected readonly SearchIncidentsOrderByEnum = SearchIncidentsOrderByEnum;
  protected readonly Number = Number;

  incidents: Incident[] = [];
  itemsPerPage = '10';
  currentPage = 1;
  totalItemsCount = 0;
  totalPages = 1;
  orderBy = SearchIncidentsOrderByEnum.ReportingDate;
  orderingAsc = true;
  navigationPages: number[] = [];

  constructor(private incidentsService: IncidentsService) {
    this.getIncidents();
  }

  getIncidents() {
    this.incidentsService
      .getIncidents(
        Number.parseInt(this.itemsPerPage),
        this.currentPage,
        this.orderBy,
        this.orderingAsc,
      )
      .subscribe({
        next: (dto: AllIncidentsDto) => {
          this.incidents = dto.incidents;
          this.totalItemsCount = dto.totalItemsCount;
          this.totalPages = dto.totalPages;
          this.updateNavigationPages();
        },
      });
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
    this.orderingAsc = true;
    this.getIncidents();
  }

  itemsPerPageChanged(event: Event) {
    this.itemsPerPage = (event.target as HTMLSelectElement).value;
    this.currentPage = 1;
    this.getIncidents();
  }

  getBadgeColor(status: IncidentStatus): 'success' | 'warning' | 'error' {
    if (status.id === IncidentStatusEnum.Closed) return 'success';
    if (status.id === IncidentStatusEnum.UnderReview) return 'error';
    return 'warning';
  }
}
