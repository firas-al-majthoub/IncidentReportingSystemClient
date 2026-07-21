import { Injectable } from '@angular/core';
import { SystemScreensEnum } from '../data/enum/system-screens.enum';
import { SystemPrivilegesEnum } from '../data/enum/system-privileges.enum';
import { map, Observable } from 'rxjs';
import { HttpRequestsService } from './http-requests.service';
import { UserRolePrivilege } from '../data/model/user-role-privilege';
import { UserRole } from '../data/model/user-role';
import { ScreenPrivilege } from '../data/dto/screen-privilege';
import { UpdateUserRolePrivilegesDto } from '../data/dto/update-user-role-privileges.dto';
import { User } from '../data/model/user';
import { SearchUserDto } from '../data/dto/search-user.dto';
import { AssignUserRoleDto } from '../data/dto/assign-user-role.dto';
import { AddRoleDto } from '../data/dto/add-role.dto';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private httpRequestsService: HttpRequestsService) {}

  userHasPrivilege(
    screen: SystemScreensEnum,
    privilege: SystemPrivilegesEnum,
  ): Observable<void> {
    const path = `/users/privilege?screenId=${screen}&privilegeId=${privilege}`;
    return this.httpRequestsService.get(path).pipe(map(() => {}));
  }

  isUserSystemAdmin(): Observable<void> {
    const path = '/users/is-system-admin';
    return this.httpRequestsService.get(path).pipe(map(() => {}));
  }

  getUserRoles(): Observable<UserRole[]> {
    const path = '/users/roles';
    return this.httpRequestsService.get(path);
  }

  getAssignableUserRoles(): Observable<UserRole[]> {
    const path = '/users/assignable-roles';
    return this.httpRequestsService.get(path);
  }

  getPrivilegesByRole(roleId: number): Observable<UserRolePrivilege[]> {
    const path = `/users/privileges-by-role/${roleId}`;
    return this.httpRequestsService.get(path);
  }

  updateUserRolePrivileges(
    roleId: number,
    screenPrivileges: ScreenPrivilege[],
  ): Observable<void> {
    const path = '/users/update-user-role-privileges';
    const dto: UpdateUserRolePrivilegesDto = {
      roleId,
      screenPrivileges,
    };

    return this.httpRequestsService.put(path, dto);
  }

  searchUser(username: string): Observable<User> {
    const path = '/users/search';
    const dto: SearchUserDto = { username };
    return this.httpRequestsService.post(path, dto);
  }

  assignUserRole(userId: number, roleId: number): Observable<User> {
    const path = '/users/assign-user-role';
    const dto: AssignUserRoleDto = {
      userId,
      roleId,
    };

    return this.httpRequestsService.patch(path, dto);
  }

  addRole(dto: AddRoleDto): Observable<void> {
    const path = '/users/add-user-role';
    return this.httpRequestsService.post(path, dto).pipe(map(() => {}));
  }
}
