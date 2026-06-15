import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'sys_user_role' })
export class SysUserRole {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', comment: '用户ID' })
  userId: number;

  @PrimaryColumn({ name: 'role_id', type: 'bigint', comment: '角色ID' })
  roleId: number;
}