import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { SelectComponent } from '../../shared/components/form/select/select.component';
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

@Component({
  selector: 'app-report-incident',
  imports: [
    CommonModule,
    RouterModule,
    InputFieldComponent,
    ComponentCardComponent,
    LabelComponent,
    SelectComponent,
    DatePickerComponent,
    RadioComponent,
    ButtonComponent,
    TextAreaComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './report-incident.component.html',
})
export class ReportIncidentComponent {
  REQUIRED_FILED_TXT = 'This field is required';
  INVALID_EMAIL_TXT = 'Please enter a valid email address';

  departments = [
    { value: '1', label: 'IT' },
    { value: '2', label: 'Risk' },
    { value: '3', label: 'HR' },
  ];

  lossTypes = [
    { value: '1', label: 'Actual Loss' },
    { value: '2', label: 'Near Miss' },
    { value: '3', label: 'Potential' },
    { value: '4', label: 'No Loss' },
  ];

  causes = [
    { value: '1', label: 'External Event' },
    { value: '2', label: 'Internal Process' },
    { value: '3', label: 'Systems' },
    { value: '4', label: 'Individuals or Employees' },
  ];

  severities = [
    { value: '1', label: 'High' },
    { value: '2', label: 'Medium' },
    { value: '3', label: 'Low' },
  ];

  isLoading = false;

  incidentForm = new FormGroup({
    description: new FormControl('', Validators.required),
    department: new FormControl('', Validators.required),
    lossType: new FormControl('', Validators.required),
    cause: new FormControl('', Validators.required),
    severity: new FormControl('', Validators.required),
    discoverDate: new FormControl('', Validators.required),
    incidentDate: new FormControl('', Validators.required),
    expectedResolvingDate: new FormControl('', Validators.required),
    financialImpactAmount: new FormControl('', Validators.required),
    involvedEmployees: new FormControl('', Validators.required),
    relatedProcedure: new FormControl('', Validators.required),
    latestUpdates: new FormControl('', Validators.required),
    correctiveAction: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.email]),
  });

  description = '';
  selectedDepartment = '';
  selectedLossType = '';
  selectedCause = '';
  selectedSeverity = '';
  discoverDate: any;
  incidentDate: any;
  expectedResolvingDate: any;
  hasFinancialImpact = true;
  financialImpactAmount = '';
  involvedEmployees = '';
  relatedProcedure = '';
  latestUpdates = '';
  correctiveAction = '';
  recovery = '';
  recoveryDate: any;
  phone = '';
  email = '';

  constructor(
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
  ) {}

  departmentChanged(val: string) {
    this.selectedDepartment = val;
  }

  lossTypeChanged(val: string) {
    this.selectedLossType = val;
  }

  causeChanged(val: string) {
    this.selectedCause = val;
  }

  severityChanged(val: string) {
    this.selectedSeverity = val;
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

  expectedResolvingDateChanged(val: any) {
    this.expectedResolvingDate = val;
  }

  hasFinancialImpactChanged(val: string) {
    this.hasFinancialImpact = val === 'true';
    this.updateAmountDisableState();
  }

  updateAmountDisableState() {
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

  submitIncident() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      return;
    }

    const incident = {
      description: this.description,
      departmentId: Number.parseInt(this.selectedDepartment),
      lossTypeId: Number.parseInt(this.selectedLossType),
      causeId: Number.parseInt(this.selectedCause),
      severityId: Number.parseInt(this.selectedSeverity),
      discoverDate: this.discoverDate.dateStr,
      incidentDate: this.incidentDate.dateStr,
      expectedResolvingDate: this.expectedResolvingDate.dateStr,
      hasFinancialImpact: this.hasFinancialImpact,
      financialImpactAmount: this.hasFinancialImpact
        ? Number.parseFloat(this.financialImpactAmount)
        : null,
      involvedEmployees: this.involvedEmployees,
      relatedProcedure: this.relatedProcedure,
      latestUpdates: this.latestUpdates,
      correctiveAction: this.correctiveAction,
      recovery: this.recovery,
      recoveryDate: this.recoveryDate ? this.recoveryDate.dateStr : null,
      phone: this.phone,
      email: this.email,
    };

    this.isLoading = true;
    this.incidentsService.reportIncident(incident).subscribe({
      next: () => {
        this.isLoading = false;
        this.toastsService.showSuccess('Incident Submitted Successfully');
      },
      error: (err: string) => {
        this.isLoading = false;
        this.toastsService.showError('Error Occurred');
      },
    });
  }
}
