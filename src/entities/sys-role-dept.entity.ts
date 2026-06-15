import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sys_role_dept' })
export class SysRoleDept {
  @PrimaryColumn({ name: 'role_id', type: 'bigint', comment: '角色ID' })
  roleId: number;

  @PrimaryColumn({ name: 'dept_id', type: 'bigint', comment: '部门ID' })
  deptId: number;
}