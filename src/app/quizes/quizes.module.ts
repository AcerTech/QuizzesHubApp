import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { QuizesRoutingModule } from './quizes-routing.module';
import { QuizesListComponent } from './quizes-list/quizes-list.component';
import { BooksService, QuizesService, QuestionsService } from '../services';
import { SharedModule } from '../SharedModule/shared.module';



@NgModule({
  declarations: [
    QuizesListComponent

  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    QuizesRoutingModule
  ],
  providers: [QuizesService, BooksService, QuestionsService]
})
export class QuizesModule { }
