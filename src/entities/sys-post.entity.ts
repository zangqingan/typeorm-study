import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_post' })
export class SysPost {
  @PrimaryGeneratedColumn({ name: 'post_id', type: 'bigint', comment: '岗位ID' })
  postId: number;

  @Column({ name: 'post_code', type: 'varchar', length: 64, comment: '岗位编码' })
  postCode: string;

  @Column({ name: 'post_name', type: 'varchar', length: 50, comment: '岗位名称' })
  postName: string;

  @Column({ name: 'post_sort', type: 'int', comment: '显示顺序' })
  postSort: number;

  @Column({ name: 'status', type: 'char', length: 1, comment: '状态（0正常 1停用）' })
  status: string;

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