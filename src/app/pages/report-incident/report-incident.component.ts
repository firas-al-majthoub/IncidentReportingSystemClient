import { Component } from '@angular/core';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import {
  SelectComponent,
  Option,
} from '../../shared/components/form/select/select.component';
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
import {
  DdlDataService,
  DdlItem,
} from '../../shared/services/ddl-data.service';
import { Router } from '@angular/router';
import { ReportIncidentDto } from '../../shared/data/dto/report-incident.dto';

@Component({
  selector: 'app-report-incident',
  imports: [
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
  protected readonly REQUIRED_FILED_TXT = 'This field is required';
  protected readonly INVALID_EMAIL_TXT = 'Please enter a valid email address';

  departments: Option[] = [];
  lossTypes: Option[] = [];
  causes: Option[] = [];
  severities: Option[] = [];

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

  incidentForm = new FormGroup({
    description: new FormControl(this.description, Validators.required),
    department: new FormControl(this.selectedDepartment, Validators.required),
    lossType: new FormControl(this.selectedLossType, Validators.required),
    cause: new FormControl(this.selectedCause, Validators.required),
    severity: new FormControl(this.selectedSeverity, Validators.required),
    discoverDate: new FormControl('', Validators.required),
    incidentDate: new FormControl('', Validators.required),
    expectedResolvingDate: new FormControl('', Validators.required),
    financialImpactAmount: new FormControl(
      this.financialImpactAmount,
      Validators.required,
    ),
    involvedEmployees: new FormControl(
      this.involvedEmployees,
      Validators.required,
    ),
    relatedProcedure: new FormControl(
      this.relatedProcedure,
      Validators.required,
    ),
    latestUpdates: new FormControl(this.latestUpdates, Validators.required),
    correctiveAction: new FormControl(
      this.correctiveAction,
      Validators.required,
    ),
    email: new FormControl(this.email, [Validators.email]),
  });

  constructor(
    public ddlDataService: DdlDataService,
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
    private router: Router,
  ) {
    this.ddlDataService.getDepartments().subscribe({
      next: (deps: DdlItem[]) => {
        this.departments = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });

    this.ddlDataService.getIncidentLossTypes().subscribe({
      next: (deps: DdlItem[]) => {
        this.lossTypes = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });

    this.ddlDataService.getIncidentCauses().subscribe({
      next: (deps: DdlItem[]) => {
        this.causes = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });

    this.ddlDataService.getIncidentSeverities().subscribe({
      next: (deps: DdlItem[]) => {
        this.severities = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

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
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: ReportIncidentDto = {
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
