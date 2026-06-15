import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'gen_table' })
export class GenTable {
  @PrimaryGeneratedColumn({ name: 'table_id', type: 'bigint', comment: '编号' })
  tableId: number;

  @Column({ name: 'table_name', type: 'varchar', length: 200, default: '', comment: '表名称' })
  tableName: string;

  @Column({ name: 'table_comment', type: 'varchar', length: 500, default: '', comment: '表描述' })
  tableComment: string;

  @Column({ name: 'sub_table_name', type: 'varchar', length: 64, nullable: true, comment: '关联子表的表名' })
  subTableName: string;

  @Column({ name: 'sub_table_fk_name', type: 'varchar', length: 64, nullable: true, comment: '子表关联的外键名' })
  subTableFkName: string;

  @Column({ name: 'class_name', type: 'varchar', length: 100, default: '', comment: '实体类名称' })
  className: string;

  @Column({ name: 'tpl_category', type: 'varchar', length: 200, default: 'crud', comment: '使用的模板（crud单表操作 tree树表操作 sub主子表操作）' })
  tplCategory: string;

  @Column({ name: 'package_name', type: 'varchar', length: 100, nullable: true, comment: '生成包路径' })
  packageName: string;

  @Column({ name: 'module_name', type: 'varchar', length: 30, nullable: true, comment: '生成模块名' })
  moduleName: string;

  @Column({ name: 'business_name', type: 'varchar', length: 30, nullable: true, comment: '生成业务名' })
  businessName: string;

  @Column({ name: 'function_name', type: 'varchar', length: 50, nullable: true, comment: '生成功能名' })
  functionName: string;

  @Column({ name: 'function_author', type: 'varchar', length: 50, nullable: true, comment: '生成功能作者' })
  functionAuthor: string;

  @Column({ name: 'form_col_num', type: 'int', default: 1, comment: '表单布局（单列 双列 三列）' })
  formColNum: number;

  @Column({ name: 'gen_type', type: 'char', length: 1, default: '0', comment: '生成代码方式（0zip压缩包 1自定义路径）' })
  genType: string;

  @Column({ name: 'gen_path', type: 'varchar', length: 200, default: '/', comment: '生成路径（不填默认项目路径）' })
  genPath: string;

  @Column({ name: 'options', type: 'varchar', length: 1000, nullable: true, comment: '其它生成选项' })
  options: string;

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