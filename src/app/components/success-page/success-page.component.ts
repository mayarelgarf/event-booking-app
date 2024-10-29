import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-success-page',
  standalone: true,
  imports: [MatButtonModule,MatCardModule],
  templateUrl: './success-page.component.html',
  styleUrl: './success-page.component.scss'
})
export class SuccessPageComponent {

}
