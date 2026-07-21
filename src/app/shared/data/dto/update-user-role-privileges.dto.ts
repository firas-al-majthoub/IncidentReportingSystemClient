import { ScreenPrivilege } from './screen-privilege';

export interface UpdateUserRolePrivilegesDto {
  roleId: number;
  screenPrivileges: ScreenPrivilege[];
}
