import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoardRoutingModule } from './board-routing.module';
import { BoardContainerComponent } from './containers/board-container/board-container.component';
import { BoardComponent } from './presenters/board/board.component';
import { NgxChessBoardModule } from "ngx-chess-board";
import { DragDropModule } from "@angular/cdk/drag-drop";
import './extensions/string.formater';

@NgModule({
  declarations: [
    BoardContainerComponent,
    BoardComponent,
  ],
  imports: [
    CommonModule,
    BoardRoutingModule,
    NgxChessBoardModule.forRoot(),
    DragDropModule
  ]
})
export class BoardModule { }
