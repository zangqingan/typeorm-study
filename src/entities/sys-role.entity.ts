import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_role' })
export class SysRole {
  @PrimaryGeneratedColumn({ name: 'role_id', type: 'bigint', comment: '角色ID' })
  roleId: number;

  @Column({ name: 'role_name', type: 'varchar', length: 30, comment: '角色名称' })
  roleName: string;

  @Column({ name: 'role_key', type: 'varchar', length: 100, comment: '角色权限字符串' })
  roleKey: string;

  @Column({ name: 'role_sort', type: 'int', comment: '显示顺序' })
  roleSort: number;

  @Column({ name: 'data_scope', type: 'char', length: 1, default: '1', comment: '数据范围（1全部 2自定 3本部门 4本部门及以下）' })
  dataScope: string;

  @Column({ name: 'status', type: 'char', length: 1, comment: '角色状态（0正常 1停用）' })
  status: string;

  @Column({ name: 'del_flag', type: 'char', length: 1, default: '0', comment: '删除标志（0存在 2删除）' })
  delFlag: string;

  @Column({ name: 'create_by', type: 'varchar', length: 64, default: '', comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @Column({ name: 'update_by', type: 'varchar', length: 64, default: '', comment: '更新者' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
  updateTime: Date;

  @Column({ name: 'remark', type: 'varchar', length: 500, nullable: true, comment: '备注' })
  remark: string;
}