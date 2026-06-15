import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_dept' })
export class SysDept {
  @PrimaryGeneratedColumn({ name: 'dept_id', type: 'bigint', comment: '部门id' })
  deptId: number;

  @Column({ name: 'parent_id', type: 'bigint', default: 0, comment: '父部门id' })
  parentId: number;

  @Column({ name: 'ancestors', type: 'varchar', length: 50, default: '', comment: '祖级列表' })
  ancestors: string;

  @Column({ name: 'dept_name', type: 'varchar', length: 30, default: '', comment: '部门名称' })
  deptName: string;

  @Column({ name: 'order_num', type: 'int', default: 0, comment: '显示顺序' })
  orderNum: number;

  @Column({ name: 'leader', type: 'varchar', length: 20, nullable: true, comment: '负责人' })
  leader: string;

  @Column({ name: 'phone', type: 'varchar', length: 11, nullable: true, comment: '联系电话' })
  phone: string;

  @Column({ name: 'email', type: 'varchar', length: 50, nullable: true, comment: '邮箱' })
  email: string;

  @Column({ name: 'status', type: 'char', length: 1, default: '0', comment: '部门状态（0正常 1停用）' })
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
}