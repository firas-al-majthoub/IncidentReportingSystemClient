import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { Incident } from '../../shared/data/model/incident';
import { IncidentsService } from '../../shared/services/incidents.service';
import { ToastsService } from '../../shared/services/toasts.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-my-returned-incidents',
  imports: [ComponentCardComponent, RouterLink, DecimalPipe],
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
}
