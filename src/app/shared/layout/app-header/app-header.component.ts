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
  protected isUserSystemAdmin = false;

  constructor(
    public sidebarService: SidebarService,
    private usersService: UsersService,
  ) {
    this.isMobileOpen$ = this.sidebarService.isMobileOpen$;
    this.getReportIncidentPrivilege();
    this.getMyReturnedIncidentsPrivilege();
    this.getViewAllIncidentsPrivilege();
    this.getSystemAdminPrivilege();
  }

  private getReportIncidentPrivilege() {
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

  private getMyReturnedIncidentsPrivilege() {
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

  private getViewAllIncidentsPrivilege() {
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

  private getSystemAdminPrivilege(): void {
    this.usersService.isUserSystemAdmin().subscribe({
      next: () => {
        this.isUserSystemAdmin = true;
      },
    });
  }
}
