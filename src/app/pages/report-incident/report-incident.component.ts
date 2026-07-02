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
  ],
  templateUrl: './report-incident.component.html',
})
export class ReportIncidentComponent {
  protected readonly REQUIRED_FILED_TXT = 'This field is required';
  protected readonly INVALID_EMAIL_TXT = 'Please enter a valid email address';
  protected readonly INVALID_EMPLOYEE_NUMBER_TXT =
    'Number must be exaclty 7 digits long';
  protected readonly REQUIRED_INVOLVED_EMPLOYEES =
    'Please enter at least one involved employee number';

  discoverDate?: any = undefined;
  incidentDate?: any = undefined;
  description = '';
  hasFinancialImpact = true;
  financialImpactAmount = '';
  recoveredFinancialLoss = false;
  recoveryAmount = '';
  recoveryDate?: any = undefined;
  involvedEmployees: string[] = [];
  relatedProcedure = '';
  correctiveAction = '';
  phone = '';
  email = '';
  tmpEmployeeNumber = '';
  showEmployeeNumberErr = false;
  showRequiredInvolvedEmployeesErr = false;

  incidentForm = new FormGroup({
    discoverDate: new FormControl('', Validators.required),
    incidentDate: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    financialImpactAmount: new FormControl('', Validators.required),
    recoveryAmount: new FormControl(''),
    recoveryDate: new FormControl(''),
    relatedProcedure: new FormControl('', Validators.required),
    correctiveAction: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
  });

  constructor(
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
    private router: Router,
  ) {}

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

  recoveredFinancialLossChanged(val: string) {
    this.recoveredFinancialLoss = val === 'true';
    this.updateRecoveredAmountDisableState();
  }

  updateLossAmountDisableState() {
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

  updateRecoveredAmountDisableState() {
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

  protected removeEmployee(employee: string) {
    this.involvedEmployees = this.involvedEmployees.filter(
      (ie) => ie != employee,
    );
  }

  protected addEmployee() {
    if (this.tmpEmployeeNumber.length == 7) {
      this.involvedEmployees.push(this.tmpEmployeeNumber);
      this.tmpEmployeeNumber = '';
      this.showEmployeeNumberErr = false;
    } else {
      this.showEmployeeNumberErr = true;
    }
  }

  submitIncident() {
    if (!this.incidentForm.valid || this.involvedEmployees.length < 1) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      this.showRequiredInvolvedEmployeesErr = true;
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
