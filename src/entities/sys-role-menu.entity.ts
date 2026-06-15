import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sys_role_menu' })
export class SysRoleMenu {
  @PrimaryColumn({ name: 'role_id', type: 'bigint', comment: '角色ID' })
  roleId: number;

  @PrimaryColumn({ name: 'menu_id', type: 'bigint', comment: '菜单ID' })
  menuId: number;
}