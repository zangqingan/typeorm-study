// 用来支持装饰器
import "reflect-metadata"
// 1. 引入数据源构造函数
import { DataSource } from "typeorm";
// 引入实体类
import { User } from "./entity/User";
import { IdCard } from "./entity/IdCard";
import { Photo } from "./entity/Photo";
import { Department } from "./entity/Department";
import { Employee } from "./entity/Employee";

// 2. 创建一个数据源实例并导出
export const AppDataSource = new DataSource({
    type: "mysql", // 数据库的类型
    host: "localhost", // 数据库服务器的主机
    port: 3306, // 数据库服务器的端口号
    username: "root",// 登录数据库的用户名
    password: "wanggeng123456", //登录数据库的密码。
    database: "typeorm-study", // 数据库名
    synchronize: true,// 同步建表，也就是当 database 里没有和 Entity 对应的表的时候，会自动生成建表 sql 语句并执行。
    logging: true,// 打印生成的 sql 语句
    entities: [User,IdCard,Photo,Department,Employee],// 指定有哪些和数据库的表对应的 Entity。
    migrations: [],
    subscribers: [],
    connectorPackage: 'mysql2',// 指定用什么驱动包
})