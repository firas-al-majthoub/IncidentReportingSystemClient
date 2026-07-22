import { Component } from '@angular/core';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { DatePickerComponent } from '../../shared/components/form/date-picker/date-picker.component';
import { RadioComponent } from '../../shared/components/form/input/radio.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import { IncidentsService } from '../../shared/services/incidents.service';
import { TextAreaComponent } from '../../shared/components/form/input/text-area.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ToastsService } from '../../shared/services/toasts.service';
import { Router } from '@angular/router';
import { ReportIncidentDto } from '../../shared/data/dto/report-incident.dto';
import { InvolvedEmployeeDto } from '../../shared/data/dto/involved-employee.dto';
import { UsersService } from '../../shared/services/users.service';
import { SystemScreensEnum } from '../../shared/data/enum/system-screens.enum';
import { SystemPrivilegesEnum } from '../../shared/data/enum/system-privileges.enum';
import { PositiveAmountDirective } from '../../shared/directive/positive-amount.directive';

@Component({
  selector: 'app-report-incident',
  imports: [
    InputFieldComponent,
    ComponentCardComponent,
    LabelComponent,
    DatePickerComponent,
    RadioComponent,
    ButtonComponent,
    TextAreaComponent,
    ReactiveFormsModule,
    PositiveAmountDirective,
  ],
  templateUrl: './report-incident.component.html',
})
export class ReportIncidentComponent {
  protected readonly REQUIRED_FILED_TXT = 'This field is required';
  protected readonly INVALID_EMAIL_TXT = 'Please enter a valid email address';
  protected readonly INVALID_EMPLOYEE_NUMBER_TXT =
    'Number must be exaclty 7 digits long';

  protected discoverDate?: any = undefined;
  protected incidentDate?: any = undefined;
  protected description = '';
  protected hasFinancialImpact = true;
  protected financialImpactAmount = '';
  protected recoveredFinancialLoss = false;
  protected recoveryAmount = '';
  protected recoveryDate?: any = undefined;
  protected involvedEmployees: InvolvedEmployeeDto[] = [];
  protected relatedProcedure = '';
  protected correctiveAction = '';
  protected phone = '';
  protected email = '';
  protected tmpEmployeeNumber = '';
  protected tmpEmployeeError = '';
  protected showEmployeeNumberErr = false;
  protected showEmployeeErrorErr = false;

  protected userHasReportPrivilege = false;

  incidentForm = new FormGroup({
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
  ) {
    this.getReportPrivilege();
  }

  ngAfterViewInit() {
    this.updateRecoveredAmountDisableState();
  }

  private getReportPrivilege(): void {
    this.usersService
      .userHasPrivilege(
        SystemScreensEnum.ReportIncident,
        SystemPrivilegesEnum.Create,
      )
      .subscribe({
        next: () => {
          this.userHasReportPrivilege = true;
        },
      });
  }

  protected discoverDateChanged(val: any) {
    this.discoverDate = val;
  }

  protected incidentDateChanged(val: any) {
    this.incidentDate = val;
  }

  protected recoveryDateChanged(val: any) {
    this.recoveryDate = val;
  }

  protected hasFinancialImpactChanged(val: string) {
    this.hasFinancialImpact = val === 'true';
    this.updateLossAmountDisableState();

    if (!this.hasFinancialImpact) {
      this.recoveredFinancialLossChanged('false');
    }
  }

  protected recoveredFinancialLossChanged(val: string) {
    this.recoveredFinancialLoss = val === 'true';
    this.updateRecoveredAmountDisableState();
  }

  protected updateLossAmountDisableState() {
    if (this.hasFinancialImpact) {
      this.incidentForm.controls.financialImpactAmount.enable();
      this.incidentForm.controls.financialImpactAmount.setValidators(
        Validators.required,
      );
      this.incidentForm.controls.financialImpactAmount.updateValueAndValidity();
    } else {
      this.incidentForm.controls.financialImpactAmount.removeValidators(
        Validators.required,
      );
      this.incidentForm.controls.financialImpactAmount.disable();
      this.incidentForm.controls.financialImpactAmount.setValue('');
      this.incidentForm.controls.financialImpactAmount.updateValueAndValidity();
    }
  }

  protected updateRecoveredAmountDisableState() {
    if (this.recoveredFinancialLoss) {
      this.incidentForm.controls.recoveryAmount.enable();
      this.incidentForm.controls.recoveryDate.enable();
      this.incidentForm.controls.recoveryAmount.setValidators(
        Validators.required,
      );
      this.incidentForm.controls.recoveryDate.setValidators(
        Validators.required,
      );
      this.incidentForm.controls.recoveryAmount.updateValueAndValidity();
      this.incidentForm.controls.recoveryDate.updateValueAndValidity();
    } else {
      this.incidentForm.controls.recoveryAmount.removeValidators(
        Validators.required,
      );
      this.incidentForm.controls.recoveryDate.removeValidators(
        Validators.required,
      );
      this.incidentForm.controls.recoveryAmount.disable();
      this.incidentForm.controls.recoveryDate.disable();
      this.incidentForm.controls.recoveryAmount.setValue('');
      this.incidentForm.controls.recoveryDate.setValue('');
      this.incidentForm.controls.recoveryAmount.updateValueAndValidity();
      this.incidentForm.controls.recoveryDate.updateValueAndValidity();
    }
  }

  protected get todayDate(): string {
    return new Date().toISOString().split('T')[0];
  }

  protected removeEmployee(employee: InvolvedEmployeeDto): void {
    this.involvedEmployees = this.involvedEmployees.filter(
      (ie) => ie != employee,
    );
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

  protected get showReportBtn(): boolean {
    return this.userHasReportPrivilege;
  }

  protected submitIncident() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: ReportIncidentDto = {
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

    this.incidentsService.reportIncident(dto).subscribe({
      next: () => {
        this.toastsService.showSuccess('Incident submitted successfully');
        this.router.navigate(['']);
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }
}
