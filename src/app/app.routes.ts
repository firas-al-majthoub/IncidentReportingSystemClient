import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { ReportIncidentComponent } from './pages/report-incident/report-incident.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { IncidentDetailsComponent } from './pages/incident-details/incident-details.component';
import { EditIncidentComponent } from './pages/edit-incident/edit-incident.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { MyReturnedIncidentsComponent } from './pages/my-returned-incidents/my-returned-incidents.component';
import { EditReturnedIncidentComponent } from './pages/edit-returned-incident/edit-returned-incident.component';
import { EditIncidentGuard } from './shared/guards/edit-incident.guard';
import { ViewAllIncidentsGuard } from './shared/guards/view-all-incidents.guard';
import { IncidentDetailsGuard } from './shared/guards/incident-details.guard';
import { EditReturnedIncidentGuard } from './shared/guards/edit-returned-incident.guard';
import { MyReturnedIncidentsGuard } from './shared/guards/my-returnedincidents.guard';
import { ReportIncidentGuard } from './shared/guards/report-incident.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    title: 'Dashboard - IRMS',
    children: [
      {
        path: 'incidents',
        component: IncidentsComponent,
        canActivate: [ViewAllIncidentsGuard],
        pathMatch: 'full',
        title: 'Incidents - IRMS',
      },
      {
        path: 'incidents/report',
        component: ReportIncidentComponent,
        canActivate: [ReportIncidentGuard],
        pathMatch: 'full',
        title: 'Report Incident - IRMS',
      },
      {
        path: 'incidents/my-returned-incidents',
        component: MyReturnedIncidentsComponent,
        canActivate: [MyReturnedIncidentsGuard],
        pathMatch: 'full',
        title: 'My Returned Incidents - IRMS',
      },
      {
        path: 'incidents/:id',
        component: IncidentDetailsComponent,
        canActivate: [IncidentDetailsGuard],
        pathMatch: 'full',
        title: 'Incident Details - IRMS',
      },
      {
        path: 'incidents/:id/edit',
        component: EditIncidentComponent,
        canActivate: [EditIncidentGuard],
        pathMatch: 'full',
        title: 'Edit Incident - IRMS',
      },
      {
        path: 'incidents/:id/edit-returned',
        component: EditReturnedIncidentComponent,
        canActivate: [EditReturnedIncidentGuard],
        pathMatch: 'full',
        title: 'Edit Incident - IRMS',
      },
    ],
  },
  // auth pages
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Sign In - IRMS',
  },
  // error pages
  {
    path: 'not-found',
    component: NotFoundComponent,
    title: 'Not Found - IRMS',
  },
  {
    path: '**',
    component: NotFoundComponent,
    title: 'Not Found - IRMS',
  },
];
