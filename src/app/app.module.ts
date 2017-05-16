import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { MdButtonModule, MdCheckboxModule, MdRadioModule, MdInputModule } from '@angular/material';
import 'hammerjs';
import { AngularFireModule } from 'angularfire2';
import 'firebase/storage'; // only import firebase storage, https://github.com/angular/angularfire2/issues/946
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { OurNotesComponent } from './our-notes/our-notes.component';
import { NoteComponent } from './note/note.component';
import { NoteFormComponent } from './note-form/note-form.component';

import { NoteService } from './service/note.service';
import { WindowRef } from './service/window-ref.service';
import { FocusMeDirective } from './focus-me.directive';
//import { RecentFirstPipe } from './recent-first.pipe';
import { AppRoutes } from './app.routes';

@NgModule({
  declarations: [
    AppComponent,
    OurNotesComponent,
    NoteComponent,
    NoteFormComponent,
    FocusMeDirective,
    //RecentFirstPipe
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AngularFireModule.initializeApp(environment.firebase, 'ng-notes'),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    ReactiveFormsModule,
    HttpModule,
    MdButtonModule, MdCheckboxModule, MdRadioModule, MdInputModule,
    RouterModule.forRoot(AppRoutes)
  ],
  providers: [
    NoteService,
    WindowRef
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
