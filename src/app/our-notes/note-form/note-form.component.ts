import { Component, OnInit, Input, Output, ElementRef, ViewChild } from '@angular/core';
import { FormsModule, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { Note, Todo } from '../Note';
import { NoteService } from '../note.service';
import { WindowRef } from '../../service/window-ref.service';

@Component({
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.css']
})
export class NoteFormComponent implements OnInit {
  @ViewChild('fileInput') inputEl: ElementRef;
  note: Note;
  noteIndex: number; // only for edit
  todoEnum = Todo;
  noteForm: FormGroup;
  submitted: boolean;
  imgToRemove: boolean;
  _fileChanged: boolean; // selected or removed
  imageFailedToLoad: boolean = false; // to indicate the case where the given image url failed to load
  /* 
  note that it does not subscribe to value changes of this form.
  on button click, form value is checked and then manually taken to model.
  */

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    public noteService: NoteService,
    private windowRef: WindowRef) { }

  ngOnInit() {
    this.noteForm = this.formBuilder.group({
      name: ['', Validators.required],
      text: ['', Validators.required]
    });
    this._fileChanged = false;

    // inspect route
    const addOrEdit = this.route.snapshot.url.length === 2; // ':name/add' or ':name/edit/:id'
    const group = this.route.snapshot.params['name'];
    const idToEdit = this.route.snapshot.params['id'];
    const idxToEdit = this.route.snapshot.queryParams['i'];
    console.log('\'NoteFormComponent\'', addOrEdit ? 'adding' : 'editing', idToEdit, idxToEdit, this.route.snapshot);

    if (addOrEdit) { // add
      this.noteIndex = -1;
      const previousName = this.windowRef.nativeWindow.localStorage.getItem('name');

      this.note = {
        group: group,
        name: previousName ? previousName : '',
        text: '',
        updatedAt: '',
        imageURL: ''
      };

      if (!this.noteService.groupName) { // page refresh
        this.noteService.getGroupNotes(group);
      }

      this.initDone(addOrEdit);
    } else { // edit
      this.noteIndex = idxToEdit;

      this.noteService.getNotePromise(idToEdit, group).then((response) => {
        this.note = response;
        if (this.note.imageURL) {
          console.log('imageURL', this.note.imageURL);
          const img = <HTMLImageElement>document.querySelector("#myimg");
          img.addEventListener('load', () => console.log('load event'));
          img.addEventListener('error', () => {
            console.log('error event');
            this.imageFailedToLoad = true;
          });
          img.src = this.note.imageURL;
        }

        this.initDone(addOrEdit);
      })
    }

  }

  cancel(e) {
    e.stopPropagation();
    this.noteForm.patchValue(this.note); // restore original
    this.noteService.todo = Todo.List;

    console.log('cancel', this.noteIndex);
    this.goBack(true);
  }

  private changed() { // compare form value and this.note
    if (this.noteService.todo === Todo.Add) return true; // add, changed of course
    const orig = this.note;
    const form = this.noteForm.value;
    const changed = form.name !== orig.name || form.text !== orig.text || this._fileChanged || this.imageFailedToLoad;
    return changed;
  }

  fileSelected() {
    //this.imgToRemove = false;
    this._fileChanged = true;
    console.log(`fileSelected ${this.inputEl.nativeElement.files.length} file(s), imgToRemove=${this.imgToRemove}`);
  }

  private goBack(cancelling = false) {
    const params = cancelling && this.noteIndex === -1 ? null : { i: this.noteIndex };

    this.router.navigate(['group', this.noteService.groupName],
      { queryParams: params });
  }

  private initDone(addOrEdit: boolean) {
    this.noteService.todo = addOrEdit ? Todo.Add : Todo.Edit;

    // apply model to view
    this.noteForm.patchValue(this.note);

    this.submitted = false;
  }

  remove(e) {
    e.stopPropagation();
    this.noteService.todo = Todo.Remove;
    this.saveNote();
  }

  removeFile(e) {
    this.inputEl.nativeElement.value = ''; // remove any selected file
    this.imgToRemove = true; // hide any downloaded image
    this._fileChanged = true;
    console.log(`removeFile ${this.inputEl.nativeElement.files.length} file(s), imgToRemove=${this.imgToRemove}`);
  }

  save(e) { // add or edit
    e.stopPropagation();
    console.log(`save ${this.noteForm.status} changed=${this.changed()}, ${this.inputEl.nativeElement.files.length} file(s), imgToRemove=${this.imgToRemove}`);
    if (this.noteForm.invalid) {
      this.submitted = true;
      return;
    }

    if (this.changed()) {
      // take form value to model
      this.note.name = this.noteForm.value.name;
      this.note.text = this.noteForm.value.text;

      this.saveNote(this.imgToRemove);
    } else { // no change, go back without making server call
      this.noteService.todo = Todo.List;
      this.goBack();
    }
  }

  private saveNote(toRemoveExistingImage?: boolean) { // assumes this.note has form value
    let inputEl: HTMLInputElement = this.inputEl.nativeElement;

    this.noteService.save(this.note, inputEl.files, this.imageFailedToLoad, toRemoveExistingImage)
      .then(() => {
        console.log('saved');
        this.goBack();
      })
      .catch((error) => console.log('saveNote error', error));
  }

  get toHideButton(): boolean {
    const hideIt = this.inputEl.nativeElement.files.length === 0 && this.note && !this.note.imageURL/* && this.note.imageURL !== 'remove'*/;
    return hideIt as boolean;
  }

  get toHideImg(): boolean {
    const hideIt = this.imgToRemove || this.imageFailedToLoad || !this.note || !this.note.imageURL || (this.inputEl.nativeElement.files.length > 0 && this.note.imageURL);
    return hideIt as boolean;
  }
}
