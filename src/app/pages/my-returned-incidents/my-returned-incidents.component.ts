import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { BadgeComponent } from '../../shared/components/ui/badge/badge.component';
import { Incident } from '../../shared/data/model/incident';
import { IncidentsService } from '../../shared/services/incidents.service';
import { ToastsService } from '../../shared/services/toasts.service';
import { IncidentStatusEnum } from '../../shared/data/enum/incident-status.enum';

@Component({
  selector: 'app-my-returned-incidents',
  imports: [ComponentCardComponent, BadgeComponent, RouterLink],
  templateUrl: './my-returned-incidents.component.html',
})
export class MyReturnedIncidentsComponent {
  incidents: Incident[] = [];

  constructor(
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
  ) {
    this.getIncidents();
  }

  getIncidents() {
    this.incidentsService.getMyReturnedIncidents().subscribe({
      next: (incidents: Incident[]) => {
        this.incidents = incidents;
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

  getBadgeColor(incident: Incident): 'success' | 'warning' | 'error' {
    if (incident.status.id === IncidentStatusEnum.Closed) return 'success';
    if (incident.status.id === IncidentStatusEnum.UnderReview) return 'error';
    return 'warning';
  }
}
