import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MenuRoutingModule } from './menu-routing.module';
import { MenuContainerComponent } from './containers/menu-container/menu-container.component';
import { MenuComponent } from './presenters/menu/menu.component';
import { MatInputModule } from "@angular/material/input";
import { ReactiveFormsModule } from "@angular/forms";
import { GamesListComponent } from './presenters/games-list/games-list.component';


@NgModule({
  declarations: [
    MenuContainerComponent,
    MenuComponent,
    GamesListComponent
  ],
  imports: [
    CommonModule,
    MenuRoutingModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class MenuModule { }
