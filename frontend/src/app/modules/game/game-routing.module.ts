import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';
import { GamePlayComponent } from './components/game-play.component';
import { GameHistoryComponent } from './components/game-history.component';

const routes: Routes = [
  {
    path: 'play',
    component: GamePlayComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'history',
    component: GameHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: 'play',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GameRoutingModule {}
