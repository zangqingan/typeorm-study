// 用来支持装饰器
import "reflect-metadata"
// 1. 引入数据源构造函数
import { DataSource } from "typeorm";

// 切换数据库和实体类
// const currentEntities = ["src/entities/**/*.ts"]
// const currentDatabase = "ruoyi_study";
const currentEntities = ["src/entity/**/*.ts"]
const currentDatabase = "typeorm-study";

// 2. 创建一个数据源实例并导出
export const AppDataSource = new DataSource({
    type: "mysql", // 数据库的类型
    host: "localhost", // 数据库服务器的主机
    port: 3306, // 数据库服务器的端口号
    username: "root",// 登录数据库的用户名
    password: "wanggeng123456", //登录数据库的密码。
    database: currentDatabase, // 数据库名
    logging: true,// 打印生成的 sql 语句
    entities: currentEntities,// 自动引入 entities 目录下所有的实体
    subscribers: [],
    connectorPackage: 'mysql2',// 指定用什么驱动包

    // basic setup
    synchronize: false,// 同步建表，也就是当 database 里没有和 Entity 对应的表的时候，会自动生成建表 sql 语句并执行。
    migrations: ["src/migrations/**/*{.js,.ts}"],   // 迁移文件输出目录
    
    // optional
    migrationsRun: false,
    migrationsTableName: "migrations",     // 记录迁移历史的表名
    migrationsTransactionMode: "all",
})