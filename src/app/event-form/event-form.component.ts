import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { eventsForm } from '../interfaces/events.interface';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router } from '@angular/router';
import { mainPath } from '../enums/main-path.enums';
import { Subject, takeUntil } from 'rxjs';
@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
})
export class EventFormComponent implements OnInit {
  _destroy$ = new Subject<void>();
  eventForm: FormGroup;
  undoStack: eventsForm[] = [];
  redoStack: eventsForm[] = [];
  isSubmitted: boolean = false;
  errorMessages: string[] = [];
  get canUndo(): boolean {
    return this.undoStack.length > 1; // Enable if there’s something to undo beyond the initial state
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }
  constructor(private _fb: FormBuilder, private _router: Router) {
    this.eventForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      acceptTerms: [false],
    });
  }
  ngOnInit() {
    this.handleFormChanges();
  }
  handleFormChanges() {
    this.pushToUndoStack();
    this.eventForm.valueChanges
      .pipe(takeUntil(this._destroy$))
      .subscribe(() => {
        if (this.redoStack.length > 1) {
          this.redoStack = []; // Clear redo stack on new changes
        }

        this.pushToUndoStack();
      });
  }
  pushToUndoStack() {
    const eventsForm: eventsForm = { ...this.eventForm.value };
    this.undoStack.push(eventsForm);
  }


  undo() {
    if (this.undoStack.length > 1) {
      // Prevent undo beyond initial state
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
      this.isSubmitted = false;
      this._router.navigate([mainPath.SUCCESS_PAGE]);
    }
  }
  ngOnDestroy() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
