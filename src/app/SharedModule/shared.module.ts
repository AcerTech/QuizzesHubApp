import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedRoutingModule } from './shared-routing.module';
import { OrderByPipe } from './order-by.pipe';


@NgModule({
  declarations: [
    OrderByPipe,
  ],
  imports: [
    CommonModule,
    SharedRoutingModule
  ],
  exports:[OrderByPipe]
})
export class SharedModule { }
