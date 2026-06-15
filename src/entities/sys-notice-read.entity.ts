import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity({ name: 'sys_notice_read' })
@Unique(['userId', 'noticeId'])
export class SysNoticeRead {
  @PrimaryGeneratedColumn({ name: 'read_id', type: 'bigint', comment: '已读主键' })
  readId: number;

  @Column({ name: 'notice_id', type: 'int', comment: '公告id' })
  noticeId: number;

  @Column({ name: 'user_id', type: 'bigint', comment: '用户id' })
  userId: number;

  @CreateDateColumn({ name: 'read_time', type: 'datetime', comment: '阅读时间' })
  readTime: Date;
}