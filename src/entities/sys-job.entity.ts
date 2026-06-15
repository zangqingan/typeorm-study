import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_job' })
export class SysJob {
  @PrimaryGeneratedColumn({ name: 'job_id', type: 'bigint', comment: '任务ID' })
  jobId: number;

  @Column({ name: 'job_name', type: 'varchar', length: 64, default: '', comment: '任务名称' })
  jobName: string;

  @Column({ name: 'job_group', type: 'varchar', length: 64, default: 'DEFAULT', comment: '任务组名' })
  jobGroup: string;

  @Column({ name: 'invoke_target', type: 'varchar', length: 500, comment: '调用目标字符串' })
  invokeTarget: string;

  @Column({ name: 'cron_expression', type: 'varchar', length: 255, default: '', comment: 'cron执行表达式' })
  cronExpression: string;

  @Column({ name: 'misfire_policy', type: 'varchar', length: 20, default: '3', comment: '计划执行错误策略（1立即执行 2执行一次 3放弃执行）' })
  misfirePolicy: string;

  @Column({ name: 'concurrent', type: 'char', length: 1, default: '1', comment: '是否并发执行（0允许 1禁止）' })
  concurrent: string;

  @Column({ name: 'status', type: 'char', length: 1, default: '0', comment: '状态（0正常 1暂停）' })
  status: string;

  @Column({ name: 'create_by', type: 'varchar', length: 64, default: '', comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @Column({ name: 'update_by', type: 'varchar', length: 64, default: '', comment: '更新者' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
  updateTime: Date;

  @Column({ name: 'remark', type: 'varchar', length: 500, default: '', comment: '备注信息' })
  remark: string;
}