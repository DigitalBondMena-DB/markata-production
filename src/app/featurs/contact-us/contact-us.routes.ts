import { Routes } from "@angular/router";
import { contactGuard } from "./guards/contact.guard";

export const routes: Routes = [

    {
        path: 'done',
        loadComponent: () =>
            import('./pages/contact-done/contact-done.component').then(m => m.ContactDoneComponent),
        canActivate: [contactGuard]
    }
]