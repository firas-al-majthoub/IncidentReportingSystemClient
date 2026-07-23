import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { User } from '../../shared/data/model/user';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { UsersService } from '../../shared/services/users.service';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { ToastsService } from '../../shared/services/toasts.service';
import {
  SelectComponent,
  Option,
} from '../../shared/components/form/select/select.component';
import { UserRole } from '../../shared/data/model/user-role';

@Component({
  selector: 'app-assign-users-role',
  imports: [
    ComponentCardComponent,
    ButtonComponent,
    LabelComponent,
    ModalComponent,
    SelectComponent,
  ],
  templateUrl: './assign-users-role.component.html',
})
export class AssignUsersRoleComponent {
  protected currentUser: User | null = null;
  protected roles: Option[] = [];
  protected searchUsername = '';
  protected isAssignModalOpen = false;
  protected selectedRole = '';
  protected isRevokeModalOpen = false;

  constructor(
    private usersService: UsersService,
    private toastsService: ToastsService,
  ) {
    this.getRoles();
  }

  private getRoles(): void {
    this.usersService.getAssignableUserRoles().subscribe({
      next: (roles: UserRole[]) => {
        this.roles = roles.map<Option>((r) => {
          return { value: `${r.id}`, label: r.nameEn };
        });
      },
    });
  }

  protected onUsernameKeydown(event: KeyboardEvent): void {
    if (event.key == 'Enter') {
      this.findUser();
      return;
    }

    this.allowOnlyNumbers(event);
  }

  private allowOnlyNumbers(event: KeyboardEvent): void {
    // Allow functional navigation/editing keys
    const allowedKeys = [
      'Backspace',
      'Delete',
      'Tab',
      'Escape',
      'ArrowLeft',
      'ArrowRight',
      'Home',
      'End',
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    // Block the keypress if it is not a digit (0-9)
    const isNumber = /^[0-9]$/.test(event.key);

    if (!isNumber) {
      event.preventDefault();
    }
  }

  protected findUser(): void {
    this.usersService.searchUser(this.searchUsername).subscribe({
      next: (user: User) => {
        this.updateCurrentUser(user);
      },
      error: () => {
        this.updateCurrentUser(null);
      },
    });
  }

  private updateCurrentUser(user: User | null) {
    this.currentUser = user;
    const roleId = this.currentUser!.roleId;
    this.selectedRole = roleId != null ? `${roleId}` : '';
  }

  protected openAssignModal() {
    this.isAssignModalOpen = true;
  }

  protected closeAssignModal() {
    this.isAssignModalOpen = false;
  }

  protected openRevokeModal() {
    this.isRevokeModalOpen = true;
  }

  protected closeRevokeModal() {
    this.isRevokeModalOpen = false;
  }

  protected assignRole() {
    this.closeAssignModal();
    const newRoleId = +this.selectedRole;

    if (newRoleId > 0 && newRoleId != this.currentUser?.roleId) {
      this.usersService
        .assignUserRole(this.currentUser!.id, newRoleId)
        .subscribe({
          next: (user: User) => {
            this.updateCurrentUser(user);
            this.toastsService.showSuccess('Role assigned successfully');
          },
          error: () => {
            this.toastsService.showError('Error occurred');
          },
        });
    }
  }

  protected revokeUserRole(): void {
    this.closeRevokeModal();
    
    this.usersService.revokeUserRole(this.currentUser!.id).subscribe({
      next: (user: User) => {
        this.updateCurrentUser(user);
        this.toastsService.showSuccess('Role revoked successfully');
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }
}
