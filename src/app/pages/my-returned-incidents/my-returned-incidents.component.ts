import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { Incident } from '../../shared/data/model/incident';
import { IncidentsService } from '../../shared/services/incidents.service';
import { ToastsService } from '../../shared/services/toasts.service';
import { DecimalPipe } from '@angular/common';
import { SystemScreensEnum } from '../../shared/data/enum/system-screens.enum';
import { SystemPrivilegesEnum } from '../../shared/data/enum/system-privileges.enum';
import { UsersService } from '../../shared/services/users.service';

@Component({
  selector: 'app-my-returned-incidents',
  imports: [ComponentCardComponent, RouterLink, DecimalPipe],
  templateUrl: './my-returned-incidents.component.html',
})
export class MyReturnedIncidentsComponent {
  incidents: Incident[] = [];
  protected userHasUpdatePrivilege = false;

  constructor(
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
    private usersService: UsersService,
  ) {
    this.getUpdatePrivilege();
    this.getIncidents();
  }

  private getUpdatePrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.EditReturnedIncident,
        SystemPrivilegesEnum.Read,
      )
      .subscribe({
        next: () => {
          this.userHasUpdatePrivilege = true;
        },
      });
  }

  protected get showUpdateBtn(): boolean {
    return this.userHasUpdatePrivilege;
  }

  private getIncidents() {
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
