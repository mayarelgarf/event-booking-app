import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IEventsForm } from '../interfaces/events.interface';

@Injectable({
  providedIn: 'root'
})
export class FormHandlerService {



  constructor() { }

  undo(undoStack:IEventsForm[],redoStack:IEventsForm[],form:FormGroup) {
    if (undoStack.length > 1) { // Prevent undo beyond initial state
      const currentState = undoStack.pop()!;
      redoStack.push(currentState);
      const previousState = undoStack[undoStack.length - 1];
      form.setValue(previousState);
    }
  }

  redo(undoStack:IEventsForm[],redoStack:IEventsForm[],form:FormGroup) {
    if (redoStack.length > 0) {
      const redoState = redoStack.pop()!;
      undoStack.push(redoState);
      form.setValue(redoState);
    }
  }
}
