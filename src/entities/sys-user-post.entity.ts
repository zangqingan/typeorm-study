import { Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'sys_user_post' })
export class SysUserPost {
  @PrimaryColumn({ name: 'user_id', type: 'bigint', comment: '用户ID' })
  userId: number;

  @PrimaryColumn({ name: 'post_id', type: 'bigint', comment: '岗位ID' })
  postId: number;
}