import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  error = '';
  success = '';

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit() {
    this.error = '';
    this.success = '';

    this.auth
      .register({ name: this.name, email: this.email, password: this.password })
      .subscribe({
        next: () => {
          this.success = 'Inscription réussie, vous pouvez vous connecter.';
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.error =
            err.error?.message || "Erreur lors de l’inscription.";
        }
      });
  }
}
