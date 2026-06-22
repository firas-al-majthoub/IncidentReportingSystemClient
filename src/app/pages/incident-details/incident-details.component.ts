import { Component, computed, input } from '@angular/core';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { IncidentsService } from '../../shared/services/incidents.service';
import { Incident } from '../../shared/data/model/incident';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-incident-details',
  imports: [ComponentCardComponent, LabelComponent],
  templateUrl: './incident-details.component.html',
})
export class IncidentDetailsComponent {
  protected id = input.required<number>();
  incident?: Incident;

  constructor(
    private incidentsService: IncidentsService,
    private router: Router,
  ) {}

  ngOnInit() {
    const incidentId = this.id();

    this.incidentsService.getIncidentDetails(incidentId).subscribe({
      next: (incident: Incident) => {
        this.incident = incident;
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 404) this.router.navigate(['not-found']);
      },
    });
  }
}
