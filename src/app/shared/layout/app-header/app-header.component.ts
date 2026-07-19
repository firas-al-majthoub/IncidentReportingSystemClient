import { Component } from '@angular/core';
import { SidebarService } from '../../services/sidebar.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeToggleButtonComponent } from '../../components/common/theme-toggle/theme-toggle-button.component';
import { UserDropdownComponent } from '../../components/header/user-dropdown/user-dropdown.component';
import { SystemPrivilegesEnum } from '../../data/enum/system-privileges.enum';
import { SystemScreensEnum } from '../../data/enum/system-screens.enum';
import { UsersService } from '../../services/users.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    ThemeToggleButtonComponent,
    UserDropdownComponent,
  ],
  templateUrl: './app-header.component.html',
})
export class AppHeaderComponent {
  isApplicationMenuOpen = false;
  readonly isMobileOpen$;
  protected showReportIncidentBtn = false;
  protected showMyReturnedIncidentsBtn = false;
  protected showViewAllIncidentsBtn = false;

  constructor(
    public sidebarService: SidebarService,
    private usersService: UsersService,
  ) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.getReportIncidentPrivilege();
    this.getMyReturnedIncidentsPrivilege();
    this.getViewAllIncidentsPrivilege();
  }

  handleToggle() {
    if (window.innerWidth >= 1280) {
      this.sidebarService.toggleExpanded();
    } else {
      this.sidebarService.toggleMobileOpen();
    }
  }

  toggleApplicationMenu() {
    this.isApplicationMenuOpen = !this.isApplicationMenuOpen;
  }

  protected getReportIncidentPrivilege() {
    return this.usersService
      .userHasPrivilege(
        SystemScreensEnum.ReportIncident,
        SystemPrivilegesEnum.Read,
      )
      .subscribe({
        next: () => {
          this.showReportIncidentBtn = true;
        },
      });
  }

  protected getMyReturnedIncidentsPrivilege() {
    return this.usersService
      .userHasPrivilege(
        SystemScreensEnum.MyReturnedIncidents,
        SystemPrivilegesEnum.Read,
      )
      .subscribe({
        next: () => {
          this.showMyReturnedIncidentsBtn = true;
        },
      });
  }

  protected getViewAllIncidentsPrivilege() {
    return this.usersService
      .userHasPrivilege(
        SystemScreensEnum.ViewAllIncidents,
        SystemPrivilegesEnum.Read,
      )
      .subscribe({
        next: () => {
          this.showViewAllIncidentsBtn = true;
        },
      });
  }
}
