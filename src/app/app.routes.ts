import { Routes } from '@angular/router';
import { LoginFormComponent } from './page/login-form/login-form.component';
import { RegisterFormComponent } from './page/register-form/register-form.component';
import { HomePageComponent } from './page/home-page/home-page.component';
import { NotFoundPageComponent } from './page/not-found-page/not-found-page.component';
import { authGuard, blockClientRoleGuard } from './common/guard/auth.guard';
import { MemberManagementComponent } from './page/member-management/member-management.component';
import { ProductManagementComponent } from './page/product-management/product-management.component';
import { ProductDetailComponent } from './page/product-management/product-detail/product-detail.component';

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
        path: "member",
        children: [
            {
                path: "management",
                component: MemberManagementComponent
            }
        ],
        canActivate: [authGuard, blockClientRoleGuard]
    },
    {
        path: "product",
        children: [
            {
                path: "management",
                component: ProductManagementComponent
            },
            {
                path: "detail/:productId",
                component: ProductDetailComponent
            }
        ],
        canActivate: [authGuard]
    },
    {
        path: "**",
        component: NotFoundPageComponent
    }
];
