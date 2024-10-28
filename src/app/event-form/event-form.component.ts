import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { eventsForm } from '../interfaces/events.interface';

@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss']
})
export class EventFormComponent {
  eventForm: FormGroup;
  undoStack: eventsForm[] = [];
  redoStack: eventsForm[] = [];
  constructor(private _fb: FormBuilder) {
    this.eventForm = this._fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      acceptTerms: [false],

    });
  }
  ngOnInit() {
    // Save initial state
    this.pushToUndoStack();

    // Track changes
    this.eventForm.valueChanges.subscribe(() => {
      if(this.redoStack.length >1){
        this.redoStack = []; // Clear redo stack on new changes
      }

      this.pushToUndoStack();
    });
  }
  pushToUndoStack() {

    const eventsForm: eventsForm = { ...this.eventForm.value };


    console.log('pushing to undo stack',eventsForm)
    this.undoStack.push(eventsForm);

  }
  get canUndo(): boolean {
    return this.undoStack.length > 1; // Enable if there’s something to undo beyond the initial state
  }

  get canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  undo() {
    if (this.undoStack.length > 1) { // Prevent undo beyond initial state
      const currentState = this.undoStack.pop()!;
      console.log('item poped',currentState)
      this.redoStack.push(currentState);
      const previousState = this.undoStack[this.undoStack.length - 1];
      console.log('previous state',previousState)
      this.eventForm.setValue(previousState,{emitEvent:false});
    }
  }

  redo() {
    if (this.redoStack.length > 0) {
      const redoState = this.redoStack.pop()!;
      this.undoStack.push(redoState);
      this.eventForm.setValue(redoState);
    }
  }

}

