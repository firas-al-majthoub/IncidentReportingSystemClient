import { Component, input } from '@angular/core';
import { Incident } from '../../shared/data/model/incident';
import { IncidentsService } from '../../shared/services/incidents.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { InputFieldComponent } from '../../shared/components/form/input/input-field.component';
import { ComponentCardComponent } from '../../shared/components/common/component-card/component-card.component';
import { LabelComponent } from '../../shared/components/form/label/label.component';
import { TextAreaComponent } from '../../shared/components/form/input/text-area.component';
import {
  SelectComponent,
  Option,
} from '../../shared/components/form/select/select.component';
import { DatePickerComponent } from '../../shared/components/form/date-picker/date-picker.component';
import { RadioComponent } from '../../shared/components/form/input/radio.component';
import { ButtonComponent } from '../../shared/components/ui/button/button.component';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  DdlDataService,
  DdlItem,
} from '../../shared/services/ddl-data.service';
import { ModalComponent } from '../../shared/components/ui/modal/modal.component';
import { ToastsService } from '../../shared/services/toasts.service';
import { CloseIncidentDto } from '../../shared/data/dto/close-incident.dto';
import { ReturnIncidentDto } from '../../shared/data/dto/return-incident.dto';
import { IncidentStatusEnum } from '../../shared/data/enum/incident-status.enum';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-edit-incident',
  imports: [
    ComponentCardComponent,
    LabelComponent,
    TextAreaComponent,
    InputFieldComponent,
    SelectComponent,
    DatePickerComponent,
    RadioComponent,
    ButtonComponent,
    ReactiveFormsModule,
    ModalComponent,
  ],
  templateUrl: './edit-incident.component.html',
})
export class EditIncidentComponent {
  protected readonly IncidentStatusEnum = IncidentStatusEnum;

  protected readonly REQUIRED_FILED_TXT = 'This field is required';
  protected readonly INVALID_EMAIL_TXT = 'Please enter a valid email address';

  protected id = input.required<number>();
  protected incident?: Incident;

  protected isCloseModalOpen = false;
  protected isReturnModalOpen = false;
  protected isUpdateModalOpen = false;

  protected departments: Option[] = [];
  protected lossTypes: Option[] = [];
  protected causes: Option[] = [];
  protected severities: Option[] = [];

  protected description = '';
  protected selectedDepartment = '';
  protected selectedLossType = '';
  protected selectedCause = '';
  protected selectedSeverity = '';
  protected discoverDate: any;
  protected incidentDate: any;
  protected expectedResolvingDate: any;
  protected hasFinancialImpact = true;
  protected financialImpactAmount = '';
  protected originalFinancialImpactAmount = '';
  protected involvedEmployees = '';
  protected relatedProcedure = '';
  protected latestUpdates = '';
  protected correctiveAction = '';
  protected recovery = '';
  protected recoveryDate: any;
  protected phone = '';
  protected email = '';
  protected resolutionNotes = '';

  protected incidentForm = new FormGroup({
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

  protected incidentClosureForm = new FormGroup({
    resolutionNotes: new FormControl(this.resolutionNotes, Validators.required),
  });

  constructor(
    protected ddlDataService: DdlDataService,
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.ddlDataService.getDepartments().subscribe({
      next: (deps: DdlItem[]) => {
        this.departments = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
    });

    this.ddlDataService.getIncidentLossTypes().subscribe({
      next: (deps: DdlItem[]) => {
        this.lossTypes = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
    });

    this.ddlDataService.getIncidentCauses().subscribe({
      next: (deps: DdlItem[]) => {
        this.causes = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
    });

    this.ddlDataService.getIncidentSeverities().subscribe({
      next: (deps: DdlItem[]) => {
        this.severities = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
    });
  }

  ngOnInit() {
    const incidentId = this.id();

    this.incidentsService.getIncidentDetails(incidentId).subscribe({
      next: (incident: Incident) => {
        this.incident = incident;

        this.description = incident.description;
        this.selectedDepartment = `${incident.department.id}`;
        this.selectedLossType = `${incident.lossType.id}`;
        this.selectedCause = `${incident.cause.id}`;
        this.selectedSeverity = `${incident.severity.id}`;
        this.discoverDate = { dateStr: incident.discoverDate };
        this.incidentDate = { dateStr: incident.incidentDate };
        this.expectedResolvingDate = {
          dateStr: incident.expectedResolvingDate,
        };
        this.hasFinancialImpact = incident.hasFinancialImpact;
        this.financialImpactAmount =
          incident.financialImpactAmount == null
            ? ''
            : `${incident.financialImpactAmount}`;
        this.originalFinancialImpactAmount =
          incident.financialImpactAmount == null
            ? ''
            : `${incident.financialImpactAmount}`;
        this.involvedEmployees = incident.involvedEmployees;
        this.relatedProcedure = incident.relatedProcedure;
        this.latestUpdates = incident.latestUpdates;
        this.correctiveAction = incident.correctiveAction;
        this.recovery = incident.recovery ?? '';
        this.recoveryDate = { dateStr: incident.recoveryDate };
        this.phone = incident.phone ?? '';
        this.email = incident.email ?? '';

        this.incidentForm.controls.description.setValue(this.description);
        this.incidentForm.controls.department.setValue(this.selectedDepartment);
        this.incidentForm.controls.lossType.setValue(this.selectedLossType);
        this.incidentForm.controls.cause.setValue(this.selectedCause);
        this.incidentForm.controls.severity.setValue(this.selectedSeverity);
        this.incidentForm.controls.discoverDate.setValue(incident.discoverDate);
        this.incidentForm.controls.incidentDate.setValue(incident.incidentDate);
        this.incidentForm.controls.expectedResolvingDate.setValue(
          incident.expectedResolvingDate,
        );
        this.incidentForm.controls.financialImpactAmount.setValue(
          this.financialImpactAmount,
        );
        this.incidentForm.controls.involvedEmployees.setValue(
          this.involvedEmployees,
        );
        this.incidentForm.controls.relatedProcedure.setValue(
          this.relatedProcedure,
        );
        this.incidentForm.controls.latestUpdates.setValue(this.latestUpdates);
        this.incidentForm.controls.correctiveAction.setValue(
          this.correctiveAction,
        );
        this.incidentForm.controls.email.setValue(this.email);

        this.incidentForm.updateValueAndValidity();
      },
      error: (err: HttpErrorResponse) => {
        if (err.status == 404) {
          this.router.navigate(['not-found']);
        } else {
          this.toastsService.showError('Error occurred');
        }
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
      this.incidentForm.controls.financialImpactAmount.setValue(
        this.originalFinancialImpactAmount,
      );
      this.incidentForm.controls.financialImpactAmount.setValidators(
        Validators.required,
      );
      this.incidentForm.controls.financialImpactAmount.updateValueAndValidity();
    } else {
      this.incidentForm.controls.financialImpactAmount.disable();
      this.incidentForm.controls.financialImpactAmount.setValue('');
      this.incidentForm.controls.financialImpactAmount.removeValidators(
        Validators.required,
      );
      this.incidentForm.controls.financialImpactAmount.updateValueAndValidity();
    }
  }

  protected isUserIncidentReporter() {
    return (
      this.incident != null &&
      this.authService.currentUser() != null &&
      this.authService.currentUser()!.id == this.incident?.reportedBy.id
    );
  }

  protected isReturnedIncident(): boolean {
    return (
      this.incident != null &&
      this.incident.status.id == IncidentStatusEnum.Returned
    );
  }

  protected isUnderReviewIncident(): boolean {
    return (
      this.incident != null &&
      this.incident.status.id == IncidentStatusEnum.UnderReview
    );
  }

  protected isClosedIncident(): boolean {
    return (
      this.incident != null &&
      this.incident.status.id == IncidentStatusEnum.Closed
    );
  }

  protected isManagerUser(): boolean {
    return this.authService.isManagerUser();
  }

  protected openIncidentCloseModal() {
    this.isCloseModalOpen = true;
  }

  protected closeIncidentCloseModal() {
    this.isCloseModalOpen = false;
  }

  protected openIncidentReturnModal() {
    this.isReturnModalOpen = true;
  }

  protected closeIncidentReturnModal() {
    this.isReturnModalOpen = false;
  }

  protected openIncidentUpdateModal() {
    this.isUpdateModalOpen = true;
  }

  protected closeIncidentUpdateModal() {
    this.isUpdateModalOpen = false;
  }

  protected closeIncident() {
    if (!this.incidentForm.valid || !this.incidentClosureForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.incidentClosureForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: CloseIncidentDto = {
      id: this.incident!.id,
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
      resolutionNotes: this.resolutionNotes,
    };

    this.closeIncidentCloseModal();
    this.incidentsService.closeIncident(dto).subscribe({
      next: () => {
        this.toastsService.showSuccess('Incident closed successfully');
        this.router.navigate(['/incidents']);
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

  protected returnIncident() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: ReturnIncidentDto = {
      id: this.incident!.id,
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

    this.closeIncidentReturnModal();
    this.incidentsService.returnIncident(dto).subscribe({
      next: () => {
        this.toastsService.showSuccess('Incident returned successfully');
        this.router.navigate(['/incidents']);
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }

  protected updateIncident() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: ReturnIncidentDto = {
      id: this.incident!.id,
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

    this.closeIncidentUpdateModal();
    this.incidentsService.updateIncident(dto).subscribe({
      next: () => {
        this.toastsService.showSuccess('Incident updated successfully');
        this.router.navigate(['']);
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }
}
