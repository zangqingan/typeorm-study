import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sys_oper_log' })
export class SysOperLog {
  @PrimaryGeneratedColumn({ name: 'oper_id', type: 'bigint', comment: '日志主键' })
  operId: number;

  @Column({ name: 'title', type: 'varchar', length: 50, default: '', comment: '模块标题' })
  title: string;

  @Column({ name: 'business_type', type: 'int', default: 0, comment: '业务类型（0其它 1新增 2修改 3删除）' })
  businessType: number;

  @Column({ name: 'method', type: 'varchar', length: 200, default: '', comment: '方法名称' })
  method: string;

  @Column({ name: 'request_method', type: 'varchar', length: 10, default: '', comment: '请求方式' })
  requestMethod: string;

  @Column({ name: 'operator_type', type: 'int', default: 0, comment: '操作类别（0其它 1后台用户 2手机端用户）' })
  operatorType: number;

  @Column({ name: 'oper_name', type: 'varchar', length: 50, default: '', comment: '操作人员' })
  operName: string;

  @Column({ name: 'dept_name', type: 'varchar', length: 50, default: '', comment: '部门名称' })
  deptName: string;

  @Column({ name: 'oper_url', type: 'varchar', length: 255, default: '', comment: '请求URL' })
  operUrl: string;

  @Column({ name: 'oper_ip', type: 'varchar', length: 128, default: '', comment: '主机地址' })
  operIp: string;

  @Column({ name: 'oper_location', type: 'varchar', length: 255, default: '', comment: '操作地点' })
  operLocation: string;

  @Column({ name: 'oper_param', type: 'varchar', length: 2000, default: '', comment: '请求参数' })
  operParam: string;

  @Column({ name: 'json_result', type: 'varchar', length: 2000, default: '', comment: '返回参数' })
  jsonResult: string;

  @Column({ name: 'status', type: 'int', default: 0, comment: '操作状态（0正常 1异常）' })
  status: number;

  @Column({ name: 'error_msg', type: 'varchar', length: 2000, default: '', comment: '错误消息' })
  errorMsg: string;

  @CreateDateColumn({ name: 'oper_time', type: 'datetime', comment: '操作时间' })
  operTime: Date;

  @Column({ name: 'cost_time', type: 'bigint', default: 0, comment: '消耗时间' })
  costTime: number;
}