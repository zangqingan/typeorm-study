import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sys_logininfor' })
export class SysLogininfor {
  @PrimaryGeneratedColumn({ name: 'info_id', type: 'bigint', comment: '访问ID' })
  infoId: number;

  @Column({ name: 'login_name', type: 'varchar', length: 50, default: '', comment: '登录账号' })
  loginName: string;

  @Column({ name: 'ipaddr', type: 'varchar', length: 128, default: '', comment: '登录IP地址' })
  ipaddr: string;

  @Column({ name: 'login_location', type: 'varchar', length: 255, default: '', comment: '登录地点' })
  loginLocation: string;

  @Column({ name: 'browser', type: 'varchar', length: 50, default: '', comment: '浏览器类型' })
  browser: string;

  @Column({ name: 'os', type: 'varchar', length: 50, default: '', comment: '操作系统' })
  os: string;

  @Column({ name: 'status', type: 'char', length: 1, default: '0', comment: '登录状态（0成功 1失败）' })
  status: string;

  @Column({ name: 'msg', type: 'varchar', length: 255, default: '', comment: '提示消息' })
  msg: string;

  @CreateDateColumn({ name: 'login_time', type: 'datetime', comment: '访问时间' })
  loginTime: Date;
}