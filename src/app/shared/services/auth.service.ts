import { Injectable, signal } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../data/model/user';
import { UserRolesEnum } from '../data/enum/user-roles.enum';
import { LoginResponseDto } from '../data/dto/login-response.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_USER_KEY = 'AUTH_USER';
  private readonly AUTH_TOKEN_KEY = 'AUTH_TOKEN';

  private readonly apiBaseUrl = 'https://localhost:7090';
  private currentUserSignal = signal<User | null>(this.getUserFromStorage());

  readonly currentUser = this.currentUserSignal.asReadonly();

  constructor(private http: HttpClient) {}

  signIn(email: string, password: string): Observable<void> {
    const url = `${this.apiBaseUrl}/users/login`;
    const dto = { email, password };
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.http.post<LoginResponseDto>(url, dto, { headers }).pipe(
      map((res: LoginResponseDto) => {
        this.authUser = res.user;
        this.authToken = res.token;
      }),
    );
  }

  isAuthenticated(): boolean {
    return this.currentUserSignal() != null;
  }

  get authToken(): string | null {
    return localStorage.getItem(this.AUTH_TOKEN_KEY);
  }

  private set authToken(token: string | null) {
    if (token == null) {
      localStorage.removeItem(this.AUTH_TOKEN_KEY);
    } else {
      localStorage.setItem(this.AUTH_TOKEN_KEY, token);
    }
  }

  private set authUser(user: User | null) {
    if (user == null) {
      this.currentUserSignal.set(null);
      localStorage.removeItem(this.AUTH_USER_KEY);
    } else {
      this.currentUserSignal.set(user);
      localStorage.setItem(this.AUTH_USER_KEY, JSON.stringify(user));
    }
  }

  userHasRole() {
    return this.isAuthenticated() && this.currentUserSignal()!.roleId != null;
  }

  isManagerUser(): boolean {
    return (
      this.isAuthenticated() &&
      this.currentUserSignal()!.roleId == UserRolesEnum.Manager
    );
  }

  isViewerUser(): boolean {
    return (
      this.isAuthenticated() &&
      this.currentUserSignal()!.roleId == UserRolesEnum.Viewer
    );
  }

  isViewerOrManagerUser(): boolean {
    return (
      this.isAuthenticated() && (this.isViewerUser() || this.isManagerUser())
    );
  }

  signOut() {
    this.authUser = null;
    this.authToken = null;
  }

  private getUserFromStorage(): User | null {
    const data = localStorage.getItem(this.AUTH_USER_KEY);
    if (!data) return null;

    try {
      return JSON.parse(data) as User;
    } catch {
      return null;
    }
  }
}
