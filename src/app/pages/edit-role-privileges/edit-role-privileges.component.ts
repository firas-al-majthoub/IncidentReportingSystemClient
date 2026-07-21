import { Component, input } from '@angular/core';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import {
  DdlDataService,
  DdlItem,
} from '../../shared/services/ddl-data.service';
import { CheckboxComponent } from '../../shared/components/form/input/checkbox.component';
import { UserRolePrivilege } from '../../shared/data/model/user-role-privilege';
import { UsersService } from '../../shared/services/users.service';
import { ScreenPrivilege } from '../../shared/data/dto/screen-privilege';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { ToastsService } from '../../shared/services/toasts.service';

@Component({
  selector: 'app-edit-role-privileges',
  imports: [ComponentCardComponent, CheckboxComponent, ButtonComponent],
  templateUrl: './edit-role-privileges.component.html',
})
export class EditRolePrivilegesComponent {
  protected id = input.required<number>();
  protected systemScreens: DdlItem[] = [];
  protected systemPrivileges: DdlItem[] = [];
  protected screenPrivileges: ScreenPrivilege[] = [];
  protected isScreenSectionOpen: boolean[] = [];

  constructor(
    private ddlDataService: DdlDataService,
    private usersService: UsersService,
    private toastsService: ToastsService,
  ) {
    this.getSystemScreens();
    this.getSystemPrivileges();
  }

  ngOnInit() {
    this.getUserRolePrivileges();
  }

  private getSystemScreens(): void {
    this.ddlDataService.getSystemScreens().subscribe({
      next: (screens: DdlItem[]) => {
        this.systemScreens = screens;
        this.constructSectionsOpenCondition(screens);
      },
    });
  }

  private constructSectionsOpenCondition(screens: DdlItem[]): void {
    this.isScreenSectionOpen = screens.map(() => true);
  }

  private getSystemPrivileges(): void {
    this.ddlDataService.getSystemPrivileges().subscribe({
      next: (privileges: DdlItem[]) => {
        this.systemPrivileges = privileges;
      },
    });
  }

  private getUserRolePrivileges(): void {
    const userRoleId = this.id();
    this.usersService.getPrivilegesByRole(userRoleId).subscribe({
      next: (privileges: UserRolePrivilege[]) => {
        this.constructScreenPrivileges(privileges);
      },
    });
  }

  private constructScreenPrivileges(rolePrivileges: UserRolePrivilege[]): void {
    this.screenPrivileges = [];

    for (const privilege of rolePrivileges) {
      const screenPrivilege: ScreenPrivilege = {
        id: privilege.id,
        screenId: privilege.systemScreenId,
        privilegeId: privilege.systemPrivilegeId,
        enable: privilege.enabled,
      };

      this.screenPrivileges.push(screenPrivilege);
    }
  }

  protected isChecked(screen: DdlItem, privilege: DdlItem): boolean {
    const screenPrivilege = this.screenPrivileges.find(
      (sp) => sp.screenId == screen.id && sp.privilegeId == privilege.id,
    );

    return screenPrivilege != null && screenPrivilege.enable;
  }

  protected checkedChange(
    screen: DdlItem,
    privilege: DdlItem,
    enabled: boolean,
  ): void {
    const screenPrivilege = this.screenPrivileges.find(
      (sp) => sp.screenId == screen.id && sp.privilegeId == privilege.id,
    );

    if (screenPrivilege != null) {
      screenPrivilege.enable = enabled;
    } else {
      const newScreenPrivilege: ScreenPrivilege = {
        id: null,
        screenId: screen.id,
        privilegeId: privilege.id,
        enable: enabled,
      };

      this.screenPrivileges.push(newScreenPrivilege);
    }
  }

  protected updatePrivileges(): void {
    const userRoleId = this.id();
    this.usersService
      .updateUserRolePrivileges(userRoleId, this.screenPrivileges)
      .subscribe({
        next: () => {
          this.toastsService.showSuccess('Privileges updated successfully');
          this.getUserRolePrivileges();
        },
        error: () => {
          this.toastsService.showError('Error occurred');
        },
      });
  }
}
