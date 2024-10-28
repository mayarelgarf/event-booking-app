import { Routes } from '@angular/router';
import { EventFormComponent } from './event-form/event-form.component';
import { mainPath } from './enums/main-path.enums';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  {path:'', redirectTo:mainPath.HOME,pathMatch:'full'},
  {path: mainPath.HOME,component:HomeComponent},
  {path:mainPath.EVENT_FORM, component:EventFormComponent}
];
