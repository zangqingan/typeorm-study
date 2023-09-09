// 用来支持装饰器
import "reflect-metadata"
// 1. 引入数据源构造函数
import { DataSource } from "typeorm";
// 引入实体类
import { User } from "./entity/User/inex";

// 2. 创建一个数据源实例并到处
export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "wanggeng123456",
    database: "typeorm-study",
    synchronize: true,
    logging: true,
    entities: [User],
    migrations: [],
    subscribers: [],
})