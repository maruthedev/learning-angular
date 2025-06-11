import { Routes } from '@angular/router';
import { LoginFormComponent } from './page/login-form/login-form.component';
import { RegisterFormComponent } from './page/register-form/register-form.component';
import { HomePageComponent } from './page/home-page/home-page.component';

export const routes: Routes = [
    {
        path: "",
        component: HomePageComponent
    },
    {
        path: "login",
        component: LoginFormComponent
    },
    {
        path: "register",
        component: RegisterFormComponent
    }
];
