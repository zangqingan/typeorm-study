# typeorm-study
TypeORM学习记录，TypeORM 是一个ORM（对象关系模型）框架，它可以运行在 NodeJS、Browser、Cordova、PhoneGap、Ionic、React Native、Expo 和 Electron 平台上，可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用。和我们学习的mongoose类似的，就是不直接写sql操作数据库而是通过实体类，直接用类似JavaScript代码的代码操作数据库。

# 一、安装及基本使用

## 1.1 快速开始
使用 TypeORM 的最快方法是使用其 CLI 命令来快速生成启动项目。
首先全局安装：npm install typeorm -g
然后就可以利用typeorm 命令初始化一个typeorm项目：typeorm init --name MyProject --database mysql
其中name参数指定项目的名称，database指定将要使用的数据库。

也可以不全局安装typeorm而使用 npx 命令：npx typeorm@latest init --name MyProject --database mysql

这两种方式效果是一样的都将在MyProject目录中生成一个包含以下文件的新项目:

```
MyProject
├── src              // TypeScript 代码
│   ├── entity       // 存储实体（数据库模型）的位置
│   │   └── User.ts  // 示例 entity
│   ├── migration    // 存储迁移的目录
│   └── index.ts     // 程序执行主文件
├── .gitignore       // gitignore文件
├── ormconfig.json   // ORM和数据库连接配置
├── package.json     // node module 依赖
├── README.md        // 简单的 readme 文件
└── tsconfig.json    // TypeScript 编译选项

```

然后安装依赖执行运行命令即可启动服务。

## 1.2 自己配置
1. 初始化为node项目,生成包管理文件
npm init -y
2. 初始化为ts项目,生成ts配置文件并安装ts,ts-node类型提示
tsc --init
npm install typescript --save 
npm install ts-node --save 
这里要确保使用的是 TypeScript 编译器版本2.3或更高版本,并且已经在tsconfig.json中启用了以下设置:

```
{
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
}
```

其它ts配置看需求开启即可.
3. 安装typeorm,获得typeorm支持
npm install typeorm --save
4. 安装 reflect-metadata,获得装饰器支持
npm install reflect-metadata --save
5. 安装 node typings(以此来使用 Node 的智能提示)
npm install @types/node --save
6. 安装数据库驱动,这里我们使用mysql2
npm install mysql2 --save
7. 修改包管理文件中的启动脚本
"start": "ts-node src/index.ts"

至此需要的依赖安装完毕,目录结构参考typeorm脚手架生成的
```
MyProject
├── src              // TypeScript 代码
│   ├── entity       // 存储实体（数据库模型）的位置
│   │   └── User.ts  // 示例 entity
│   ├── migration    // 存储迁移的目录
│   └── index.ts     // 程序执行主文件
├── .gitignore       // gitignore文件
├── LICENSE          // 版权文件
├── package.json     // node module 依赖
├── README.md        // 简单的 readme 文件
└── tsconfig.json    // TypeScript 编译选项

```

## 1.3 基本使用

# 二、创建数据库连接
只有在和数据库建立连接后才能与数据库进行交互。在typeorm中最简单和最常用的方法是使用createConnection和createConnections函数。不难看出前者是创建单个连接,后者是创建多个连接然而这两个api已经废弃了.版本迭代发展是很快的要看官网.

在新版本里使用数据源 DataSource 构造函数初始化数据库连接配置对象,然后调用实例方法initialize初始化连接,使用destroy方法关闭连接,但是后端服务器一般是保持运行的则不需要关闭连接。

## 2.1 创建一个新的数据源实例(连接)

一般是声明一个变量接受执行 DataSource 构造函数返回的实例对象并导出,这样需要使用的地方导入这个实例即可. 这个构造函数接受一个配置对象.使用的数据库不同配置对象的配置项也不同,mysql的如下.
具体配置可以查看官网即可.

```
data-source.ts
// 1. 引入数据源构造函数
import { DataSource } from "typeorm";

// 2. 创建一个数据源实例并到处
export const AppDataSource = new DataSource({
    type: "mysql", // 指定使用的数据类型
    host: "localhost", // 连接主机名
    port: 3306, // 连接主机端口
    username: "test", // 连接数据库用户名
    password: "test", // 连接数据库密码
    database: "test", // 连接的数据库名称
    synchronize: true, // 是否根据实体同步建表
    logging: false, // 是否打印对应的sql语句
    entities: [User], // 声明的要加载并用于此连接的实体类。
    migrations: [],
    subscribers: [], // 要加载并用于此连接的订阅者。
})

任意需要的地方引入实例对象调用初始化方法即可开始使用.
如:index.ts
// 1.引入数据源实例对象
import { AppDataSource } from "./data-source"
// 2. 调用实例方法 initialize() 初始化连接
AppDataSource.initialize()
    .then(() => {
        // 建立连接成功后,在这里可以对数据库进行curd操作
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
```
设置数据源并导出后就可以在任意地方使用只需要引入即可,接下来要学习熟悉的就是数据源实例属性和方法了.

# 三、实体

我们使用typeorm的初心就是不用编写大量难以维护的 SQL 语句来 curd数据库,而是通过代码直接操作.
typeorm是orm即对象关系模型,它是把数据库中的一个表抽象为一个JavaScript类,而在写法上一个JavaScript类就是一个js或ts文件. 所以我们可以认为一个实体就是一张数据库表/schema就是一个js/ts文件罢了.

## 3.1 实体定义

实体Entity是由@Entity装饰器装饰的一个类,这个类会映射为数据库中的一个表.所以要定义一个实体是很简单的只需要声明一个类并用 @Entity装饰器装饰即可.此时声明的实体类就是一个表,但是数据库中表的列还没声明.
要添加数据库列，只需要将要生成的实体属性加上@Column装饰器即可,这样被@Column装饰器装饰的列就会被添加到对应的表中.数据库中的列类型也是根据你使用的属性类型推断的，例如： number将被转换为integer，string将转换为varchar，boolean转换为bool等。可以给@Column()装饰器传入一个配置对象指定要创建列的配置.
每个数据库表必须具有包含主键的列,所以每个实体也必须至少有一个主键列。在typeorm中使用@PrimaryColumn装饰器和@PrimaryGeneratedColumn装饰器,后者是主键列自动递增生成,@PrimaryGeneratedColumn("uuid") 可以传入一个uuid参数这样就会自动生成一个唯一的字符串id.

```
user.ts
// 1. 引入实体装饰器
import { Entity } from 'typeorm'

// 2. 声明实体类
@Entity()
export class User {
@Column()
    id: number

    @Column()
    name: string

    @Column()
    description: string

    @Column()
    filename: string

    @Column()
    views: number

    @Column()
    isPublished: boolean
}
```

声明一个实体之后必须在数据源的entities 选项中注册不然获取不到.


## 3.2 实体的增删改查
实体创建好之后数据库中对应的表也就有了,这时对实体的curd操作也就是对表了.
要想对实体实现curd等操作需要 理解两个东西:EntityManager 和 Repository.
EntityManager 实体管理者:它是一个存放实体存储库集合的地方,通过它可以对任意实体进行管理（insert, update, delete, load 等）使用EntityManager你可以操纵应用中的任何实体。
Repository 仓库就像EntityManager一样，但其操作仅限于具体实体。

## 3.3 EntityManager 实体管理者







# 三、实体

# 三、实体
