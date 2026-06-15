import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_notice' })
export class SysNotice {
  @PrimaryGeneratedColumn({ name: 'notice_id', type: 'int', comment: '公告ID' })
  noticeId: number;

  @Column({ name: 'notice_title', type: 'varchar', length: 50, comment: '公告标题' })
  noticeTitle: string;

  @Column({ name: 'notice_type', type: 'char', length: 1, comment: '公告类型（1通知 2公告）' })
  noticeType: string;

  @Column({ name: 'notice_content', type: 'longblob', nullable: true, comment: '公告内容' })
  noticeContent: Buffer;

  @Column({ name: 'status', type: 'char', length: 1, default: '0', comment: '公告状态（0正常 1关闭）' })
  status: string;

  @Column({ name: 'create_by', type: 'varchar', length: 64, default: '', comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @Column({ name: 'update_by', type: 'varchar', length: 64, default: '', comment: '更新者' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
  updateTime: Date;

  @Column({ name: 'remark', type: 'varchar', length: 255, nullable: true, comment: '备注' })
  remark: string;
}