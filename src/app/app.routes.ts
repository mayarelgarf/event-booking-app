import { Routes } from '@angular/router';
import { EventFormComponent } from './components/event-form/event-form.component';
import { mainPath } from './enums/main-path.enums';
import { HomeComponent } from './components/home/home.component';
import { SuccessPageComponent } from './components/success-page/success-page.component';

export const routes: Routes = [
  {path:'', redirectTo:mainPath.HOME,pathMatch:'full'},
  {path: mainPath.HOME,component:HomeComponent},
  {path:mainPath.EVENT_FORM, component:EventFormComponent},
  {path:mainPath.SUCCESS_PAGE, component:SuccessPageComponent},
  {path:'**', component:HomeComponent}
];
