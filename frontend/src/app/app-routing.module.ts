import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { DashboardComponent } from './shared/components/dashboard.component';

/**
 * Rotas Principais da Aplicação
 * Configura navegação entre módulos
 */
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () => import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'game',
    loadChildren: () => import('./modules/game/game.module').then(m => m.GameModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'ranking',
    loadChildren: () => import('./modules/ranking/ranking.module').then(m => m.RankingModule),
    canActivate: [AuthGuard]
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
