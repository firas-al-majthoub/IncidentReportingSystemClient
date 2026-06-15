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
import { ButtonsComponent } from '../ui-elements/buttons/buttons.component';
import { IncidentService } from '../../shared/services/incident.service';
import { TextAreaComponent } from '../../shared/components/form/input/text-area.component';

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
    ButtonsComponent,
    TextAreaComponent,
  ],
  templateUrl: './report-incident.component.html',
})
export class ReportIncidentComponent {
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

  constructor(private incidentService: IncidentService) {}

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
    console.log(val);
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
  }

  submitIncident() {
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
      financialImpactAmount: this.hasFinancialImpact ? Number.parseFloat(this.financialImpactAmount) : null,
      involvedEmployees: this.involvedEmployees,
      relatedProcedure: this.relatedProcedure,
      latestUpdates: this.latestUpdates,
      correctiveAction: this.correctiveAction,
      recovery: this.recovery,
      recoveryDate: this.recoveryDate ? this.recoveryDate.dateStr : null,
      phone: this.phone,
      email: this.email,
    };

    console.log(incident);

    this.incidentService.reportIncident(incident).subscribe({
      next: () => {
        console.log(`next inside component`);
      },
      error: (err: string) => {
        console.log(`err inside component:`);
        console.log(err);
      },
    });
  }
}
