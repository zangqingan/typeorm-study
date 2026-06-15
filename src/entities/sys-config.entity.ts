import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_config' })
export class SysConfig {
  @PrimaryGeneratedColumn({ name: 'config_id', type: 'int', comment: '参数主键' })
  configId: number;

  @Column({ name: 'config_name', type: 'varchar', length: 100, default: '', comment: '参数名称' })
  configName: string;

  @Column({ name: 'config_key', type: 'varchar', length: 100, default: '', comment: '参数键名' })
  configKey: string;

  @Column({ name: 'config_value', type: 'varchar', length: 500, default: '', comment: '参数键值' })
  configValue: string;

  @Column({ name: 'config_type', type: 'char', length: 1, default: 'N', comment: '系统内置（Y是 N否）' })
  configType: string;

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