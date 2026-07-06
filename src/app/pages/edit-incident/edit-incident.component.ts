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
import { InvolvedEmployeeDto } from '../../shared/data/dto/involved-employee.dto';
import { UpdateIncidentDto } from '../../shared/data/dto/update-incident.dto';

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
  protected readonly INVALID_EMPLOYEE_NUMBER_TXT =
    'Number must be exaclty 7 digits long';

  protected id = input.required<number>();
  protected incident?: Incident;

  protected isCloseModalOpen = false;
  protected isReturnModalOpen = false;
  protected isUpdateModalOpen = false;

  protected departments: Option[] = [];
  protected lossTypes: Option[] = [];
  protected causes: Option[] = [];

  protected reportingDate?: { dateStr: string } = undefined;
  protected discoverDate?: { dateStr: string } = undefined;
  protected incidentDate?: { dateStr: string } = undefined;
  protected description = '';
  protected hasFinancialImpact = true;
  protected financialImpactAmount = '';
  protected recoveredFinancialLoss = false;
  protected recoveryAmount = '';
  protected recoveryDate?: { dateStr: string } = undefined;
  protected riskDescription = '';
  protected involvedEmployees: InvolvedEmployeeDto[] = [];
  protected relatedProcedure = '';
  protected correctiveAction = '';
  protected phone = '';
  protected email = '';
  protected selectedLossType = '';
  protected selectedCause = '';
  protected selectedReporterDepartment = '';
  protected selectedResponsibleDepartment = '';
  protected resolutionNotes = '';
  protected returnNotes = '';

  protected tmpEmployeeNumber = '';
  protected tmpEmployeeError = '';
  protected showEmployeeNumberErr = false;
  protected showEmployeeErrorErr = false;

  protected incidentForm = new FormGroup({
    riskDescription: new FormControl('', Validators.required),
    relatedProcedure: new FormControl('', Validators.required),
    correctiveAction: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    lossType: new FormControl('', Validators.required),
    cause: new FormControl('', Validators.required),
    reporterDepartment: new FormControl('', Validators.required),
    responsibleDepartment: new FormControl('', Validators.required),
  });

  protected incidentClosureForm = new FormGroup({
    resolutionNotes: new FormControl('', Validators.required),
  });

  protected incidentReturnForm = new FormGroup({
    returnNotes: new FormControl('', Validators.required),
  });

  constructor(
    protected ddlDataService: DdlDataService,
    private incidentsService: IncidentsService,
    private toastsService: ToastsService,
    private router: Router,
    private authService: AuthService,
  ) {
    this.getDepartments();
    this.getLossTypes();
    this.getCauses();
  }

  private getDepartments(): void {
    this.ddlDataService.getDepartments().subscribe({
      next: (deps: DdlItem[]) => {
        this.departments = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
    });
  }

  private getLossTypes(): void {
    this.ddlDataService.getIncidentLossTypes().subscribe({
      next: (deps: DdlItem[]) => {
        this.lossTypes = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
    });
  }

  private getCauses(): void {
    this.ddlDataService.getIncidentCauses().subscribe({
      next: (deps: DdlItem[]) => {
        this.causes = deps.map((d) => {
          return { value: `${d.id}`, label: d.nameEn };
        });
      },
    });
  }

  ngOnInit() {
    const incidentId = this.id();
    this.getIncidentDetails(incidentId);
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
    this.financialImpactAmount =
      incident.financialImpactAmount == null
        ? ''
        : `${incident.financialImpactAmount}`;

    this.recoveredFinancialLoss = incident.recoveredFinancialLoss;
    this.recoveryAmount =
      incident.recoveryAmount == null ? '' : `${incident.recoveryAmount}`;
    this.recoveryDate =
      incident.recoveryDate == null
        ? undefined
        : { dateStr: incident.recoveryDate };

    this.riskDescription = incident.riskDescription ?? '';

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
    this.selectedLossType =
      incident.lossType == null ? '' : `${incident.lossType.id}`;
    this.selectedCause = incident.cause == null ? '' : `${incident.cause.id}`;
    this.selectedReporterDepartment =
      incident.reporterDepartment == null
        ? ''
        : `${incident.reporterDepartment.id}`;
    this.selectedResponsibleDepartment =
      incident.responsibleDepartment == null
        ? ''
        : `${incident.responsibleDepartment.id}`;

    this.incidentForm.controls.riskDescription.setValue(this.riskDescription);
    this.incidentForm.controls.relatedProcedure.setValue(this.relatedProcedure);
    this.incidentForm.controls.correctiveAction.setValue(this.correctiveAction);
    this.incidentForm.controls.email.setValue(this.email);
    this.incidentForm.controls.lossType.setValue(this.selectedLossType);
    this.incidentForm.controls.cause.setValue(this.selectedCause);
    this.incidentForm.controls.reporterDepartment.setValue(
      this.selectedReporterDepartment,
    );
    this.incidentForm.controls.responsibleDepartment.setValue(
      this.selectedResponsibleDepartment,
    );

    this.incidentForm.updateValueAndValidity();
    this.incident = incident;
  }

  protected reporterDepartmentChanged(val: string) {
    this.selectedReporterDepartment = val;
  }

  protected responsibleDepartmentChanged(val: string) {
    this.selectedResponsibleDepartment = val;
  }

  protected lossTypeChanged(val: string) {
    this.selectedLossType = val;
  }

  protected causeChanged(val: string) {
    this.selectedCause = val;
  }

  private isClosedIncident(): boolean {
    return (
      this.incident != null &&
      this.incident.status.id == IncidentStatusEnum.Closed
    );
  }

  private isUnderReviewIncident(): boolean {
    return (
      this.incident != null &&
      this.incident.status.id == IncidentStatusEnum.UnderReview
    );
  }

  protected displayActionButtons(): boolean {
    return this.authService.isViewerOrManagerUser() && !this.isClosedIncident();
  }

  protected displayUpdateButton(): boolean {
    return (
      this.authService.isViewerOrManagerUser() && this.isUnderReviewIncident()
    );
  }

  protected displayCloseButton(): boolean {
    return this.authService.isManagerUser() && !this.isClosedIncident();
  }

  protected displayReturnButton(): boolean {
    return this.authService.isManagerUser() && this.isUnderReviewIncident();
  }

  protected openIncidentCloseModal() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    this.isCloseModalOpen = true;
  }

  protected closeIncidentCloseModal() {
    this.isCloseModalOpen = false;
  }

  protected openIncidentReturnModal() {
    if (!this.incidentForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

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

  allowOnlyNumbers(event: KeyboardEvent): void {
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

  private get updateIncidentDto(): UpdateIncidentDto {
    return {
      id: this.incident!.id,
      riskDescription: this.riskDescription,
      involvedEmployees: this.involvedEmployees,
      relatedProcedure: this.relatedProcedure,
      correctiveAction: this.correctiveAction,
      phone: this.phone,
      email: this.email,
      lossTypeId: Number.parseInt(this.selectedLossType),
      causeId: Number.parseInt(this.selectedCause),
      reporterDepartmentId: Number.parseInt(this.selectedReporterDepartment),
      responsibleDepartmentId: Number.parseInt(
        this.selectedResponsibleDepartment,
      ),
    };
  }

  private get closeIncidentDto(): CloseIncidentDto {
    return {
      ...this.updateIncidentDto,
      resolutionNotes: this.resolutionNotes,
    };
  }

  private get returnIncidentDto(): ReturnIncidentDto {
    return { ...this.updateIncidentDto, returnNotes: this.returnNotes };
  }

  protected closeIncident() {
    if (!this.incidentForm.valid || !this.incidentClosureForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.incidentClosureForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: CloseIncidentDto = this.closeIncidentDto;

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
    if (!this.incidentForm.valid || !this.incidentReturnForm.valid) {
      this.incidentForm.markAllAsTouched();
      this.incidentReturnForm.markAllAsTouched();
      this.toastsService.showError('Please fill all required fields');
      return;
    }

    const dto: ReturnIncidentDto = this.returnIncidentDto;

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

    const dto: UpdateIncidentDto = this.updateIncidentDto;

    this.closeIncidentUpdateModal();
    this.incidentsService.updateIncident(dto).subscribe({
      next: () => {
        this.toastsService.showSuccess('Incident updated successfully');
        this.router.navigate(['/incidents']);
      },
      error: () => {
        this.toastsService.showError('Error occurred');
      },
    });
  }
}
