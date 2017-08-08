import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MdButtonModule, MdCheckboxModule, MdRadioModule, MdInputModule } from '@angular/material';
import 'hammerjs';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { MarkdownModule } from 'angular2-markdown';

import { OurNotesComponent } from './our-notes.component';
import { GroupsComponent } from './groups/groups.component';
import { GroupComponent } from './group/group.component';
import { NoteFormComponent } from './note-form/note-form.component';

import { NoteService } from './note.service';
import { FocusMeDirective } from '../focus-me.directive';

import { OurNotesRoutingModule } from './our-notes-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MdButtonModule, MdCheckboxModule, MdRadioModule, MdInputModule,
    BsDropdownModule.forRoot(),
    MarkdownModule.forRoot(),
    OurNotesRoutingModule
  ],
  declarations: [
    OurNotesComponent,
    GroupsComponent,
    GroupComponent,
    NoteFormComponent,
    FocusMeDirective
  ],
  providers: [ NoteService ]
})
export class OurNotesModule {}