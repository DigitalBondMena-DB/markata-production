import { Routes } from "@angular/router";

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/profile/profile.component').then(m => m.ProfileComponent)
    },
    {
        path: 'edit',
        loadComponent: () =>
            import('./pages/edit-profile/edit-profile.component').then(m => m.EditProfileComponent)
    },
    {
        path: 'change-password',
        loadComponent: () =>
            import('./pages/change-password/change-password.component').then(m => m.ChangePasswordComponent)
    },
]