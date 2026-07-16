import { Routes } from "@angular/router";
import { resetPasswordGuard } from "@core/guards/reset-password.guard";

export const authRoute: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./signin/signin.component').then(m => m.SigninComponent)
    },
    {
        path: 'register',
        loadComponent: () =>
            import('./register/register.component').then(m => m.RegisterComponent)
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
            import('./forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent)
    },
    {
        path: 'reset-password',
        canActivate: [resetPasswordGuard],
        loadComponent: () =>
            import('./reset-password/reset-password.component').then(m => m.ResetPasswordComponent)
    }
]