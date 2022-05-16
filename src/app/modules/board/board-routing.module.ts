import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardContainerComponent } from "./containers/board-container/board-container.component";

const routes: Routes = [
  {path: '', component: BoardContainerComponent},
  {path: ':id', component: BoardContainerComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoardRoutingModule { }
