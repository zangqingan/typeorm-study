import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity({ name: 'sys_job_log' })
export class SysJobLog {
  @PrimaryGeneratedColumn({ name: 'job_log_id', type: 'bigint', comment: '任务日志ID' })
  jobLogId: number;

  @Column({ name: 'job_name', type: 'varchar', length: 64, comment: '任务名称' })
  jobName: string;

  @Column({ name: 'job_group', type: 'varchar', length: 64, comment: '任务组名' })
  jobGroup: string;

  @Column({ name: 'invoke_target', type: 'varchar', length: 500, comment: '调用目标字符串' })
  invokeTarget: string;

  @Column({ name: 'job_message', type: 'varchar', length: 500, nullable: true, comment: '日志信息' })
  jobMessage: string;

  @Column({ name: 'status', type: 'char', length: 1, default: '0', comment: '执行状态（0正常 1失败）' })
  status: string;

  @Column({ name: 'exception_info', type: 'varchar', length: 2000, default: '', comment: '异常信息' })
  exceptionInfo: string;

  @Column({ name: 'start_time', type: 'datetime', nullable: true, comment: '执行开始时间' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'datetime', nullable: true, comment: '执行结束时间' })
  endTime: Date;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;
}