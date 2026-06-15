// 1.引入数据源实例对象
import { AppDataSource } from "./data-source"
import { crudUser, OneToOneQuery, OneToManyQuery, ManyToManyQuery } from "./services/userQuery"// typeorm-study 数据库的用户crud操作方法
import { getUserWithDept, getUserWithDeptByJoin, getUserPermissions, getUsersInDeptAndChildren } from "./services/ruoyi_query"//若依数据库的用户查询方法
// 2. 调用实例方法 initialize() 初始化连接
async function bootstrap() {
    try {
        await AppDataSource.initialize()
        // await crudUser()
        // await OneToOneQuery(2)
        // await OneToManyQuery(1)
        await ManyToManyQuery(1)
        // await getUserWithDept(1)
        // await getUserWithDeptByJoin(1)
        // await getUserPermissions(2)
        // await getUsersInDeptAndChildren(102)
        console.log("Data Source has been initialized!")
    } catch (error) {
        console.error("Error during Data Source initialization", error)
    }
}
bootstrap()
