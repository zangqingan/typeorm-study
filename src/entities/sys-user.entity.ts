import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_user' })
export class SysUser {
  @PrimaryGeneratedColumn({ name: 'user_id', type: 'bigint', comment: '用户ID' })
  userId: number;

  @Column({ name: 'dept_id', type: 'bigint', nullable: true, comment: '部门ID' })
  deptId: number;

  @Column({ name: 'login_name', type: 'varchar', length: 30, comment: '登录账号' })
  loginName: string;

  @Column({ name: 'user_name', type: 'varchar', length: 30, default: '', comment: '用户昵称' })
  userName: string;

  @Column({ name: 'user_type', type: 'varchar', length: 2, default: '00', comment: '用户类型（00系统用户 01注册用户）' })
  userType: string;

  @Column({ name: 'email', type: 'varchar', length: 50, default: '', comment: '用户邮箱' })
  email: string;

  @Column({ name: 'phonenumber', type: 'varchar', length: 11, default: '', comment: '手机号码' })
  phonenumber: string;

  @Column({ name: 'sex', type: 'char', length: 1, default: '0', comment: '用户性别（0男 1女 2未知）' })
  sex: string;

  @Column({ name: 'avatar', type: 'varchar', length: 100, default: '', comment: '头像路径' })
  avatar: string;

  @Column({ name: 'password', type: 'varchar', length: 50, default: '', comment: '密码' })
  password: string;

  @Column({ name: 'salt', type: 'varchar', length: 20, default: '', comment: '盐加密' })
  salt: string;

  @Column({ name: 'status', type: 'char', length: 1, default: '0', comment: '账号状态（0正常 1停用）' })
  status: string;

  @Column({ name: 'del_flag', type: 'char', length: 1, default: '0', comment: '删除标志（0存在 2删除）' })
  delFlag: string;

  @Column({ name: 'login_ip', type: 'varchar', length: 128, default: '', comment: '最后登录IP' })
  loginIp: string;

  @Column({ name: 'login_date', type: 'datetime', nullable: true, comment: '最后登录时间' })
  loginDate: Date;

  @Column({ name: 'pwd_update_date', type: 'datetime', nullable: true, comment: '密码最后更新时间' })
  pwdUpdateDate: Date;

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