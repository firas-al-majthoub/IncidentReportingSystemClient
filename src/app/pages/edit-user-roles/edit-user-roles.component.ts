import { Component } from '@angular/core';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { RouterLink } from '@angular/router';
import { UserRole } from '../../shared/data/model/user-role';
import { UsersService } from '../../shared/services/users.service';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AddRoleDto } from '../../shared/data/dto/add-role.dto';
import { ToastsService } from '../../shared/services/toasts.service';

@Component({
  selector: 'app-edit-roles',
  imports: [
    ComponentCardComponent,
    RouterLink,
    ButtonComponent,
    ModalComponent,
    InputFieldComponent,
    LabelComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './edit-user-roles.component.html',
})
export class EditUserRolesComponent {
  protected readonly REQUIRED_FILED_TXT = 'This field is required';

  protected roles: UserRole[] = [];
  protected isModalOpen = false;
  protected newRoleNameEn = '';
  protected newRoleNameAr = '';
  protected newRoleForm = new FormGroup({
    nameEn: new FormControl('', Validators.required),
    nameAr: new FormControl('', Validators.required),
  });

  constructor(
    private usersService: UsersService,
    private toastsService: ToastsService,
  ) {
    this.getUserRoles();
  }

  private getUserRoles() {
    this.usersService.getAssignableUserRoles().subscribe({
      next: (roles: UserRole[]) => {
        this.roles = roles;
      },
    });
  }

  protected openAddModal() {
    this.isModalOpen = true;
  }

  protected closeAddModal() {
    this.isModalOpen = false;
  }

  protected addRole() {
    if (!this.newRoleForm.valid) {
      this.newRoleForm.markAllAsTouched();
      return;
    }

    this.closeAddModal();
    const dto: AddRoleDto = {
      nameEn: this.newRoleNameEn,
      nameAr: this.newRoleNameAr,
    };

    this.usersService.addRole(dto).subscribe({
      next: () => {
        this.getUserRoles();
        this.toastsService.showSuccess('Role added successfully');
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }
}
