import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity({ name: 'sys_user_online' })
export class SysUserOnline {
  @PrimaryColumn({ name: 'sessionId', type: 'varchar', length: 50, comment: '用户会话id' })
  sessionId: string;

  @Column({ name: 'login_name', type: 'varchar', length: 50, default: '', comment: '登录账号' })
  loginName: string;

  @Column({ name: 'dept_name', type: 'varchar', length: 50, default: '', comment: '部门名称' })
  deptName: string;

  @Column({ name: 'ipaddr', type: 'varchar', length: 128, default: '', comment: '登录IP地址' })
  ipaddr: string;

  @Column({ name: 'login_location', type: 'varchar', length: 255, default: '', comment: '登录地点' })
  loginLocation: string;

  @Column({ name: 'browser', type: 'varchar', length: 50, default: '', comment: '浏览器类型' })
  browser: string;

  @Column({ name: 'os', type: 'varchar', length: 50, default: '', comment: '操作系统' })
  os: string;

  @Column({ name: 'status', type: 'varchar', length: 10, default: '', comment: '在线状态on_line在线off_line离线' })
  status: string;

  @Column({ name: 'start_timestamp', type: 'datetime', comment: 'session创建时间' })
  startTimestamp: Date;

  @Column({ name: 'last_access_time', type: 'datetime', comment: 'session最后访问时间' })
  lastAccessTime: Date;

  @Column({ name: 'expire_time', type: 'int', default: 0, comment: '超时时间（分钟）' })
  expireTime: number;

  @Column({ name: 'session_data', type: 'blob', nullable: true, comment: '序列化的Session数据' })
  sessionData: Buffer;
}