import { Routes } from '@angular/router';
import { LoginFormComponent } from './page/login-form/login-form.component';
import { RegisterFormComponent } from './page/register-form/register-form.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { NotFoundPageComponent } from './page/not-found-page/not-found-page.component';
import { authGuard } from './guard/auth.guard';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "home",
        pathMatch: 'full'
    },
    {
        path: "home",
        component: HomePageComponent,
        canActivate: [authGuard]
    },
    {
        path: "login",
        component: LoginFormComponent
    },
    {
        path: "register",
        component: RegisterFormComponent
    },
    {
        path: "**",
        component: NotFoundPageComponent
    }
];
