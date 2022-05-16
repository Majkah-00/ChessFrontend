import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuContainerComponent } from "./containers/menu-container/menu-container.component";
import { GamesListComponent } from './presenters/games-list/games-list.component';

const routes: Routes = [
  {path: '', component: MenuContainerComponent},
  {path: 'games-list', component: GamesListComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MenuRoutingModule { }
