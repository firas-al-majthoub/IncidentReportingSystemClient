import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { ReportIncidentComponent } from './pages/report-incident/report-incident.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { IncidentDetailsComponent } from './pages/incident-details/incident-details.component';
import { EditIncidentComponent } from './pages/edit-incident/edit-incident.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { ViewerOrManagerGuard } from './shared/guards/viewer-or-manager.guard';
import { HasRoleGuard } from './shared/guards/has-role.guard';
import { MyReturnedIncidentsComponent } from './pages/my-returned-incidents/my-returned-incidents.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children: [
      {
        path: 'incidents',
        component: IncidentsComponent,
        canActivate: [ViewerOrManagerGuard],
        pathMatch: 'full',
        title: 'Incidents - IRMS',
      },
      {
        path: 'incidents/report',
        component: ReportIncidentComponent,
        canActivate: [HasRoleGuard],
        pathMatch: 'full',
        title: 'Report Incident - IRMS',
      },
      {
        path: 'incidents/my-returned-incidents',
        component: MyReturnedIncidentsComponent,
        canActivate: [HasRoleGuard],
        pathMatch: 'full',
        title: 'My Returned Incidents - IRMS',
      },
      {
        path: 'incidents/:id',
        component: IncidentDetailsComponent,
        canActivate: [ViewerOrManagerGuard],
        pathMatch: 'full',
        title: 'Incident Details - IRMS',
      },
      {
        path: 'incidents/:id/edit',
        component: EditIncidentComponent,
        canActivate: [HasRoleGuard],
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
