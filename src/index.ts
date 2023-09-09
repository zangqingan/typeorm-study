// 1.引入数据源实例对象
import { AppDataSource } from "./data-source"

// 2. 调用实例方法 initialize() 初始化连接
AppDataSource.initialize()
    .then(async () => {
        // 建立连接成功后,在这里可以对数据库进行curd操作
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })