import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { IEventFormReq, IEventsForm, IMonth } from '../../interfaces/events.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { mainPath } from '../../enums/main-path.enums';
import { Subject, takeUntil } from 'rxjs';
import { EventHttpService } from '../../services/event-http.service'
import {MatSelectModule} from '@angular/material/select';
@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,

  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers:[]
})
export class EventFormComponent implements OnInit {
  _destroy$ = new Subject<void>();
  eventForm: FormGroup;
  undoStack: IEventsForm[] = [];
  redoStack: IEventsForm[] = [];
  isSubmitted: boolean = false;
  errorMessages: string[] = [];
  months: IMonth[]=[]
  get canUndo(): boolean {
    return this.undoStack.length > 1;
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  constructor(private _fb: FormBuilder, private _router: Router,private _eventsHttpService: EventHttpService) {
    this.eventForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      acceptTerms: [false],
      month: ['', Validators.required],
    });

  }
  ngOnInit() {

    this.getMonths()
    this.handleFormChanges();
  }


  handleFormChanges() {
    this.pushToUndoStack();
    this.eventForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        if (this.redoStack.length > 1) {
          this.redoStack = [];
        }

        this.pushToUndoStack();
      });
  }
  pushToUndoStack() {
    const eventsForm: IEventsForm = { ...this.eventForm.value };
    this.undoStack.push(eventsForm);
  }


  undo() {
    if (this.undoStack.length > 1) {

      const currentState = this.undoStack.pop()!;
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      this.eventForm.setValue(previousState, { emitEvent: false });
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const redoState = this.redoStack.pop()!;
      this.undoStack.push(redoState);
      this.eventForm.setValue(redoState);
    }
  }
  getErrorMessages(): string[] {
    const messages: string[] = [];

    if (this.eventForm.controls['name'].errors) {
      if (this.eventForm.controls['name'].errors['required']) {
        messages.push('Name is required.');
      }
    }

    if (this.eventForm.controls['email'].errors) {
      if (this.eventForm.controls['email'].errors['required']) {
        messages.push('Email is required.');
      }
      if (this.eventForm.controls['email'].errors['email']) {
        messages.push('Please enter a valid email address.');
      }
    }

    return messages;
  }
  onSubmit() {
    if (this.eventForm.invalid) {
      this.errorMessages = this.getErrorMessages();
      this.isSubmitted = true;
    } else {

this.createFormApplication()

    }
  }
  getMonths(){
    this._eventsHttpService
    .getMonths()
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (months: IMonth[]) => {
        if (!months?.length)return;
        this.months = months;
      },
      error: (err: Error) => {
        console.error(err);

      },
    });


  }
  createFormApplication(){
    const {month, name,email,acceptTerms}= this.eventForm.value
    const req:IEventFormReq = {
      name:name,
      email:email,
      monthId:month,
      isNotificationAllowed:acceptTerms
    }
    this._eventsHttpService
    .createFormApp(req)
    .pipe(takeUntil(this._destroy$))
    .subscribe({
      next: (res:any) => {
        console.log(res)
        this.isSubmitted = false;
        this._router.navigate([mainPath.SUCCESS_PAGE]);
      },
      error: (err: Error) => {
        this.errorMessages.push(err.message)
        this.isSubmitted  =true
        console.error(err);

      },
    });
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
