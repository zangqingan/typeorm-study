import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity({ name: 'gen_table_column' })
export class GenTableColumn {
  @PrimaryGeneratedColumn({ name: 'column_id', type: 'bigint', comment: '编号' })
  columnId: number;

  @Column({ name: 'table_id', type: 'bigint', nullable: true, comment: '归属表编号' })
  tableId: number;

  @Column({ name: 'column_name', type: 'varchar', length: 200, nullable: true, comment: '列名称' })
  columnName: string;

  @Column({ name: 'column_comment', type: 'varchar', length: 500, nullable: true, comment: '列描述' })
  columnComment: string;

  @Column({ name: 'column_type', type: 'varchar', length: 100, nullable: true, comment: '列类型' })
  columnType: string;

  @Column({ name: 'java_type', type: 'varchar', length: 500, nullable: true, comment: 'JAVA类型' })
  javaType: string;

  @Column({ name: 'java_field', type: 'varchar', length: 200, nullable: true, comment: 'JAVA字段名' })
  javaField: string;

  @Column({ name: 'is_pk', type: 'char', length: 1, nullable: true, comment: '是否主键（1是）' })
  isPk: string;

  @Column({ name: 'is_increment', type: 'char', length: 1, nullable: true, comment: '是否自增（1是）' })
  isIncrement: string;

  @Column({ name: 'is_required', type: 'char', length: 1, nullable: true, comment: '是否必填（1是）' })
  isRequired: string;

  @Column({ name: 'is_insert', type: 'char', length: 1, nullable: true, comment: '是否为插入字段（1是）' })
  isInsert: string;

  @Column({ name: 'is_edit', type: 'char', length: 1, nullable: true, comment: '是否编辑字段（1是）' })
  isEdit: string;

  @Column({ name: 'is_list', type: 'char', length: 1, nullable: true, comment: '是否列表字段（1是）' })
  isList: string;

  @Column({ name: 'is_query', type: 'char', length: 1, nullable: true, comment: '是否查询字段（1是）' })
  isQuery: string;

  @Column({ name: 'query_type', type: 'varchar', length: 200, default: 'EQ', comment: '查询方式（等于、不等于、大于、小于、范围）' })
  queryType: string;

  @Column({ name: 'html_type', type: 'varchar', length: 200, nullable: true, comment: '显示类型（文本框、文本域、下拉框、复选框、单选框、日期控件）' })
  htmlType: string;

  @Column({ name: 'dict_type', type: 'varchar', length: 200, default: '', comment: '字典类型' })
  dictType: string;

  @Column({ name: 'sort', type: 'int', nullable: true, comment: '排序' })
  sort: number;

  @Column({ name: 'create_by', type: 'varchar', length: 64, default: '', comment: '创建者' })
  createBy: string;

  @CreateDateColumn({ name: 'create_time', type: 'datetime', comment: '创建时间' })
  createTime: Date;

  @Column({ name: 'update_by', type: 'varchar', length: 64, default: '', comment: '更新者' })
  updateBy: string;

  @UpdateDateColumn({ name: 'update_time', type: 'datetime', comment: '更新时间' })
  updateTime: Date;
}