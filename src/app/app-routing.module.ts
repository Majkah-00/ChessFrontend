import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./modules/menu/menu.module').then(m => m.MenuModule)
  },
  {
    path: 'game',
    loadChildren: () => import('./modules/board/board.module').then(m => m.BoardModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
