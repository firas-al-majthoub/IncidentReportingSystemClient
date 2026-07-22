import { Component, input } from '@angular/core';
import { Incident } from '../../shared/data/model/incident';
import { IncidentsService } from '../../shared/services/incidents.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { TextAreaComponent } from '../../shared/components/form/input/text-area.component';
import { DatePickerComponent } from '../../shared/components/form/date-picker/date-picker.component';
import { RadioComponent } from '../../shared/components/form/input/radio.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { ToastsService } from '../../shared/services/toasts.service';
import { IncidentStatusEnum } from '../../shared/data/enum/incident-status.enum';
import { UpdateReturnedIncidentDto } from '../../shared/data/dto/update-returned-incident.dto';
import { InvolvedEmployeeDto } from '../../shared/data/dto/involved-employee.dto';
import { UsersService } from '../../shared/services/users.service';
import { SystemPrivilegesEnum } from '../../shared/data/enum/system-privileges.enum';
import { SystemScreensEnum } from '../../shared/data/enum/system-screens.enum';
import { PositiveAmountDirective } from '../../shared/directive/positive-amount.directive';

@Component({
  selector: 'app-edit-returned-incident',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    TextAreaComponent,
    InputFieldComponent,
    DatePickerComponent,
    RadioComponent,
    ButtonComponent,
    ReactiveFormsModule,
    ModalComponent,
    PositiveAmountDirective,
  ],
  templateUrl: './edit-returned-incident.component.html',
})
export class EditReturnedIncidentComponent {
  protected readonly IncidentStatusEnum = IncidentStatusEnum;

  protected readonly REQUIRED_FILED_TXT = 'This field is required';
  protected readonly INVALID_EMAIL_TXT = 'Please enter a valid email address';
  protected readonly INVALID_EMPLOYEE_NUMBER_TXT =
    'Number must be exaclty 7 digits long';

  protected id = input.required<number>();
  protected incident?: Incident;

  protected isModalOpen = false;

  protected reportingDate?: { dateStr: string } = undefined;
  protected discoverDate?: { dateStr: string } = undefined;
  protected incidentDate?: { dateStr: string } = undefined;
  protected description = '';
  protected hasFinancialImpact = true;
  protected financialImpactAmount = '';
  protected originalFinancialImpactAmount = '';
  protected recoveredFinancialLoss = false;
  protected recoveryAmount = '';
  protected originalRecoveryAmount = '';
  protected recoveryDate?: { dateStr: string } = undefined;
  protected originalRecoveryDate?: { dateStr: string } = undefined;
  protected involvedEmployees: InvolvedEmployeeDto[] = [];
  protected relatedProcedure = '';
  protected correctiveAction = '';
  protected phone = '';
  protected email = '';

  protected tmpEmployeeNumber = '';
  protected tmpEmployeeError = '';
  protected showEmployeeNumberErr = false;
  protected showEmployeeErrorErr = false;

  protected userHasUpdatePrivilege = false;

  protected incidentForm = new FormGroup({
    discoverDate: new FormControl('', Validators.required),
    incidentDate: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    financialImpactAmount: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    recoveryAmount: new FormControl('', Validators.min(0)),
    recoveryDate: new FormControl(''),
    relatedProcedure: new FormControl('', Validators.required),
    correctiveAction: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
  });

  constructor(
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
    private router: Router,
    private usersService: UsersService,
  ) {}

  ngOnInit() {
    const incidentId = this.id();
    this.getUpdatePrivilege();
    this.getIncidentDetails(incidentId);
  }

  private getUpdatePrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.EditReturnedIncident,
        SystemPrivilegesEnum.Update,
      )
      .subscribe({
        next: () => {
          this.userHasUpdatePrivilege = true;
        },
      });
  }

  private getIncidentDetails(incidentId: number): void {
    this.incidentsService.getIncidentDetails(incidentId).subscribe({
      next: (incident: Incident) => {
        this.populateInitialData(incident);
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 404) this.router.navigate(['not-found']);
        else this.toastsService.showError('Error occurred');
      },
    });
  }

  private populateInitialData(incident: Incident): void {
    this.reportingDate = { dateStr: incident.reportingDate };
    this.discoverDate = { dateStr: incident.discoverDate };
    this.incidentDate = { dateStr: incident.incidentDate };
    this.description = incident.description;

    this.hasFinancialImpact = incident.hasFinancialImpact;
    this.hasFinancialImpactChanged(`${incident.hasFinancialImpact}`);
    this.financialImpactAmount =
      incident.financialImpactAmount == null
        ? ''
        : `${incident.financialImpactAmount}`;
    this.originalFinancialImpactAmount = this.financialImpactAmount;

    this.recoveredFinancialLoss = incident.recoveredFinancialLoss;
    this.recoveredFinancialLossChanged(`${incident.recoveredFinancialLoss}`);
    this.recoveryAmount =
      incident.recoveryAmount == null ? '' : `${incident.recoveryAmount}`;
    this.originalRecoveryAmount = this.recoveryAmount;
    this.recoveryDate =
      incident.recoveryDate == null
        ? undefined
        : { dateStr: incident.recoveryDate };
    this.originalRecoveryDate = this.recoveryDate;

    this.involvedEmployees = incident.involvedEmployees.map((ie) => {
      const employee: InvolvedEmployeeDto = {
        employeeNumber: ie.employeeNumber,
        employeeError: ie.employeeError,
      };

      return employee;
    });

    this.relatedProcedure = incident.relatedProcedure;
    this.correctiveAction = incident.correctiveAction;
    this.phone = incident.phone ?? '';
    this.email = incident.email ?? '';

    this.incidentForm.controls.discoverDate.setValue(incident.discoverDate);
    this.incidentForm.controls.incidentDate.setValue(incident.incidentDate);
    this.incidentForm.controls.description.setValue(this.description);
    this.incidentForm.controls.financialImpactAmount.setValue(
      this.financialImpactAmount,
    );
    this.incidentForm.controls.recoveryAmount.setValue(this.recoveryAmount);
    this.incidentForm.controls.recoveryDate.setValue(incident.recoveryDate);
    this.incidentForm.controls.relatedProcedure.setValue(this.relatedProcedure);
    this.incidentForm.controls.correctiveAction.setValue(this.correctiveAction);
    this.incidentForm.controls.email.setValue(this.email);

    this.incidentForm.updateValueAndValidity();
    this.incident = incident;
  }

  discoverDateChanged(val: any) {
    this.discoverDate = val;
  }

  incidentDateChanged(val: any) {
    this.incidentDate = val;
  }

  recoveryDateChanged(val: any) {
    this.recoveryDate = val;
  }

  hasFinancialImpactChanged(val: string) {
    this.hasFinancialImpact = val === 'true';
    this.updateLossAmountDisableState();

    if (!this.hasFinancialImpact) {
      this.recoveredFinancialLossChanged('false');
    }
  }

  updateLossAmountDisableState() {
    if (this.hasFinancialImpact) {
      this.incidentForm.controls.financialImpactAmount.enable();
      this.incidentForm.controls.financialImpactAmount.setValue(
        this.originalFinancialImpactAmount,
      );
      this.incidentForm.controls.financialImpactAmount.setValidators(
        Validators.required,
      );
      this.financialImpactAmount = this.originalFinancialImpactAmount;
    } else {
      this.incidentForm.controls.financialImpactAmount.disable();
      this.incidentForm.controls.financialImpactAmount.setValue('');
      this.incidentForm.controls.financialImpactAmount.removeValidators(
        Validators.required,
      );
      this.financialImpactAmount = '';
    }

    this.incidentForm.controls.financialImpactAmount.updateValueAndValidity();
  }

  protected recoveredFinancialLossChanged(val: string) {
    this.recoveredFinancialLoss = val === 'true';
    this.updateRecoveredAmountDisableState();
  }

  updateRecoveredAmountDisableState() {
    if (this.recoveredFinancialLoss) {
      this.incidentForm.controls.recoveryAmount.enable();
      this.incidentForm.controls.recoveryAmount.setValue(
        this.originalRecoveryAmount,
      );
      this.incidentForm.controls.recoveryAmount.setValidators(
        Validators.required,
      );
      this.recoveryAmount = this.originalRecoveryAmount;

      this.incidentForm.controls.recoveryDate.enable();
      this.incidentForm.controls.recoveryDate.setValue(
        this.originalRecoveryDate ? this.originalRecoveryDate.dateStr : '',
      );
      this.incidentForm.controls.recoveryDate.setValidators(
        Validators.required,
      );
      this.recoveryDate = this.originalRecoveryDate;
    } else {
      this.incidentForm.controls.recoveryAmount.disable();
      this.incidentForm.controls.recoveryAmount.setValue('');
      this.incidentForm.controls.recoveryAmount.removeValidators(
        Validators.required,
      );
      this.recoveryAmount = '';

      this.incidentForm.controls.recoveryDate.disable();
      this.incidentForm.controls.recoveryDate.setValue('');
      this.incidentForm.controls.recoveryDate.removeValidators(
        Validators.required,
      );
      this.recoveryDate = undefined;
    }

    this.incidentForm.controls.recoveryAmount.updateValueAndValidity();
    this.incidentForm.controls.recoveryDate.updateValueAndValidity();
  }

  protected openModal() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    this.isModalOpen = true;
  }

  protected closeModal() {
    this.isModalOpen = false;
  }

  protected addEmployee(): void {
    if (!this.validateInvolvedEmployeesInsertion()) return;

    const employee: InvolvedEmployeeDto = {
      employeeNumber: this.tmpEmployeeNumber,
      employeeError: this.tmpEmployeeError,
    };

    this.involvedEmployees.push(employee);
    this.resetInvolvedEmployeesFields();
  }

  private validateInvolvedEmployeesInsertion(): boolean {
    let isValid = true;

    if (this.tmpEmployeeNumber.length != 7) {
      this.showEmployeeNumberErr = true;
      isValid = false;
    } else {
      this.showEmployeeNumberErr = false;
    }

    if (this.tmpEmployeeError.length < 1) {
      this.showEmployeeErrorErr = true;
      isValid = false;
    } else {
      this.showEmployeeErrorErr = false;
    }

    if (this.involvedEmployeesContains(this.tmpEmployeeNumber)) {
      this.toastsService.showError(
        `Employee number you have entered is already in the list`,
      );
      isValid = false;
    }

    return isValid;
  }

  private involvedEmployeesContains(employeeNumber: string): boolean {
    return (
      this.involvedEmployees.filter((ie) => ie.employeeNumber == employeeNumber)
        .length > 0
    );
  }

  private resetInvolvedEmployeesFields(): void {
    this.tmpEmployeeNumber = '';
    this.tmpEmployeeError = '';
    this.showEmployeeNumberErr = false;
    this.showEmployeeErrorErr = false;
  }

  protected removeEmployee(employee: InvolvedEmployeeDto): void {
    this.involvedEmployees = this.involvedEmployees.filter(
      (ie) => ie != employee,
    );
  }

  protected allowOnlyNumbers(event: KeyboardEvent): void {
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

  protected get showUpdateBtn(): boolean {
    return this.userHasUpdatePrivilege;
  }

  protected updateReturnedIncident() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: UpdateReturnedIncidentDto = {
      id: this.incident!.id,
      discoverDate: this.discoverDate!.dateStr,
      incidentDate: this.incidentDate!.dateStr,
      description: this.description,
      hasFinancialImpact: this.hasFinancialImpact,
      financialImpactAmount: this.hasFinancialImpact
        ? Number.parseFloat(this.financialImpactAmount)
        : null,
      recoveredFinancialLoss: this.recoveredFinancialLoss,
      recoveryAmount: this.recoveredFinancialLoss
        ? Number.parseFloat(this.recoveryAmount)
        : null,
      recoveryDate: this.recoveredFinancialLoss
        ? this.recoveryDate!.dateStr
        : null,
      involvedEmployees: this.involvedEmployees,
      relatedProcedure: this.relatedProcedure,
      correctiveAction: this.correctiveAction,
      phone: this.phone,
      email: this.email,
    };

    this.closeModal();
    this.incidentsService.updateReturnedIncident(dto).subscribe({
      next: () => {
        this.toastsService.showSuccess('Incident updated successfully');
        this.router.navigate(['/incidents/my-returned-incidents']);
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }
}
