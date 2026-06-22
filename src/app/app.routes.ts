import { Routes } from '@angular/router';
import { NotFoundComponent } from './pages/other-page/not-found/not-found.component';
import { AppLayoutComponent } from './shared/layout/app-layout/app-layout.component';
import { SignInComponent } from './pages/auth-pages/sign-in/sign-in.component';
import { SignUpComponent } from './pages/auth-pages/sign-up/sign-up.component';
import { ReportIncidentComponent } from './pages/report-incident/report-incident.component';
import { IncidentsComponent } from './pages/incidents/incidents.component';
import { IncidentDetailsComponent } from './pages/incident-details/incident-details.component';

export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: 'incidents',
        component: IncidentsComponent,
        pathMatch: 'full',
        title: 'Incidents - IRMS',
      },
      {
        path: 'incidents/report',
        component: ReportIncidentComponent,
        pathMatch: 'full',
        title: 'Report Incident - IRMS',
      },
      {
        path: 'incidents/:id',
        component: IncidentDetailsComponent,
        pathMatch: 'full',
        title: 'Incident Details - IRMS',
      },
    ],
  },
  // auth pages
  {
    path: 'signin',
    component: SignInComponent,
    title: 'Angular Sign In Dashboard - IRMS',
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
