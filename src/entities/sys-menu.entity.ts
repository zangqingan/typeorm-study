import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'sys_menu' })
export class SysMenu {
  @PrimaryGeneratedColumn({ name: 'menu_id', type: 'bigint', comment: '菜单ID' })
  menuId: number;

  @Column({ name: 'menu_name', type: 'varchar', length: 50, comment: '菜单名称' })
  menuName: string;

  @Column({ name: 'parent_id', type: 'bigint', default: 0, comment: '父菜单ID' })
  parentId: number;

  @Column({ name: 'order_num', type: 'int', default: 0, comment: '显示顺序' })
  orderNum: number;

  @Column({ name: 'url', type: 'varchar', length: 200, default: '#', comment: '请求地址' })
  url: string;

  @Column({ name: 'target', type: 'varchar', length: 20, default: '', comment: '打开方式（menuItem页签 menuBlank新窗口）' })
  target: string;

  @Column({ name: 'menu_type', type: 'char', length: 1, default: '', comment: '菜单类型（M目录 C菜单 F按钮）' })
  menuType: string;

  @Column({ name: 'visible', type: 'char', length: 1, default: '0', comment: '菜单状态（0显示 1隐藏）' })
  visible: string;

  @Column({ name: 'is_refresh', type: 'char', length: 1, default: '1', comment: '是否刷新（0刷新 1不刷新）' })
  isRefresh: string;

  @Column({ name: 'perms', type: 'varchar', length: 100, nullable: true, comment: '权限标识' })
  perms: string;

  @Column({ name: 'icon', type: 'varchar', length: 100, default: '#', comment: '菜单图标' })
  icon: string;

  @Column({ name: 'create_by', type: 'varchar', length: 64, default: '', comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @Column({ name: 'update_by', type: 'varchar', length: 64, default: '', comment: '更新者' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
  updateTime: Date;

  @Column({ name: 'remark', type: 'varchar', length: 500, default: '', comment: '备注' })
  remark: string;
}