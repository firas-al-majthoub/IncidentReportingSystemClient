import { Component } from '@angular/core';
import { DropdownComponent } from '../../ui/dropdown/dropdown.component';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../data/model/user';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  imports: [CommonModule, RouterModule, DropdownComponent],
})
export class UserDropdownComponent {
  isOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  get currentUser(): User {
    return this.authService.currentUser()!;
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  closeDropdown() {
    this.isOpen = false;
  }

  signOut() {
    this.authService.signOut();
    this.router.navigate(['/signin']);
  }
}
