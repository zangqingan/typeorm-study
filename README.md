# typeorm-study

TypeORM学习记录，TypeORM 是一个ORM（对象关系模型）框架，它可以运行在 NodeJS、Browser、Cordova、PhoneGap、Ionic、React Native、Expo 和 Electron 平台上，可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用。

和 mongoose 类似的，就是不直接写sql操作数据库而是通过实体类，直接用类似JavaScript代码的代码操作数据库。

# 一、安装依赖

## 1.1 快速开始

使用 TypeORM 的最快方法是使用其 CLI 命令来快速生成启动项目。
首先全局安装：`npm install typeorm -g`,然后就可以利用 typeorm 命令初始化一个typeorm项目：`typeorm init --name MyProject --database mysql`

1. --name参数指定项目的名称
2. --database 指定将要使用的数据库。

也可以不全局安装 typeorm 而使用 npx 命令零时安装：`npx typeorm@latest init --name MyProject --database mysql`

这两种方式效果是一样的都将在MyProject目录中生成一个包含以下文件的新项目:

```ts
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
   `npm init -y`
2. 初始化为ts项目,生成ts配置文件并安装ts,ts-node类型提示
   `tsc --init`
   `npm install typescript --save `
   `npm install ts-node --save `
   这里要确保使用的是 TypeScript 编译器版本2.3或更高版本,并且已经在tsconfig.json中启用了以下设置:

```js
{
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
}
```

其它ts配置看需求开启即可.
3. 安装typeorm,获得typeorm支持
`npm install typeorm --save`
4. 安装 reflect-metadata,获得装饰器支持
`npm install reflect-metadata --save`
5. 安装 node typings(以此来使用 Node 的智能提示)
`npm install @types/node --save`
6. 安装数据库驱动,这里我们使用mysql2
`npm install mysql2 --save`
7. 修改包管理文件中的启动脚本
`"start": "ts-node src/index.ts"`

至此需要的依赖安装完毕,目录结构参考 typeorm 脚手架生成的

```ts
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

# 二、创建数据库连接

在typeorm中最简单和最常用的方法是使用createConnection和createConnections函数。不难看出前者是创建单个连接,后者是创建多个连接然而这两个api已经废弃了。版本迭代发展是很快的要看官网.

在新版本里使用数据源 DataSource() 构造函数初始化数据库连接配置对象,然后调用实例方法 initialize() 初始化连接,使用destroy方法关闭连接,但是后端服务器一般是保持运行的则不需要关闭连接。

![typeorm流程](./assets/typeorm流程.png)

## 2.1 创建一个新的数据源实例(连接)

一般是声明一个变量接受执行 DataSource 构造函数返回的实例对象并导出,这样需要使用的地方导入这个实例即可. 这个构造函数接受一个配置对象。使用的数据库不同配置对象的配置项也不同,mysql的如下(具体配置可以查看官网即可)。

```ts
// data-source.ts
// 1. 引入数据源构造函数
import { DataSource } from "typeorm";

// 2. 创建一个数据源实例并导出：设置数据源并导出后就可以在任意地方使用只需要引入即可。
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

// 任意需要的地方引入实例对象调用初始化方法即可开始使用
// 如:index.ts
// 1.引入数据源实例对象
import { AppDataSource } from "./data-source"
// 2. 调用实例方法 initialize() 初始化连接
async function bootstrap() {
    try {
        await AppDataSource.initialize()
        // 这之后就可以对数据库进行curd操作了
        console.log("Data Source has been initialized!")
    } catch (error) {
        console.error("Error during Data Source initialization", error)
    }
}
bootstrap()

```

# 三、定义实体

使用 typeorm 的初心就是不用编写大量难以维护的 SQL 语句来 curd 数据库,而是通过代码直接操作。

typeorm是一个对象关系模型(ORM)框架,它是把数据库中的一个表抽象为一个JavaScript类,而在写法上一个JavaScript类就是一个js或ts文件. 所以我们可以认为一个实体就是一张数据库表就是一个js/ts文件罢了。

## 3.1 实体定义

实体Entity是由 @Entity() 装饰器装饰的一个类,这个类最终会映射为数据库中的一个表。

所以要定义一个实体是很简单的只需要声明一个类并用 @Entity() 装饰器装饰即可。此时声明的实体类就是一个表,但是数据库中表的列还没声明。

要添加数据库列字段，只需要将要生成的实体属性加上 @Column() 装饰器即可,这样被 @Column 装饰器装饰的列就会被添加到对应的表中。

数据库中的列类型也是根据你使用的属性类型推断的，例如： number将被转换为integer，string将转换为varchar，boolean转换为bool等。可以给@Column()装饰器传入一个配置对象指定要创建列的配置。

每个数据库表必须具有包含主键的列,所以每个实体也必须至少有一个主键列。在typeorm中使用 @PrimaryColumn() 装饰器和 @PrimaryGeneratedColumn() 装饰器,后者是主键列自动递增生成,@PrimaryGeneratedColumn("uuid") 可以传入一个uuid参数这样就会自动生成一个唯一的字符串id。声明一个实体之后必须在数据源的 entities 选项中注册不然获取不到。

总之我们在原始sql里需要的字段约束在 typeorm  里都有对应的装饰器或者其它的东西一一对应。

```ts
// entity/User.ts
// 1. 引入实体类需要的装饰器
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

// 2. 声明实体类
// @Entity 默认生成类名对应小写的数据库表名、也可以传入一个配置对象指定表名。
// @Entity({name: 'user'})
@Entity()
export class User {
    @PrimaryGeneratedColumn({
        comment: '这是 id' // comment-添加注释
    })
    id: number

    @Column({
        name: 'a_aa',// 重命名字段名-数据库里实际的字段名
        unique: false,// 设置 UNIQUE 唯一索引
        nullable: false,//  设置 NOT NULL 约束
        length: 10,// 指定长度
        type: 'varchar',// type 指定映射的类型-数据库里的数据类型
        default: 'bbb' // 指定默认值
    })
    firstName: string

    @Column()
    lastName: string

    @Column()
    isActive: boolean
}
```

## 3.2 实体的增删改查

实体创建好之后数据库中对应的表也就有了,这时对实体的curd操作也就是对表了、要想对实体实现curd 等操作需要理解两个东西:EntityManager 和 Repository。

1. EntityManager 实体管理者:它是一个存放实体存储库集合的地方,通过它可以对任意实体进行管理（insert, update, delete, load 等）使用 EntityManager 你可以操纵应用中的任何实体。我们生成的数据源实例中就有一个对应 EntityManager 的属性 manager，然后在使用实体管理者时每次调用方法都是需要传入实体类，所以实际中我们一般不使用。

```ts
// 实体管理者
// src/crud-example.ts
import { AppDataSource } from "./data-source";

async function main() {
    await AppDataSource.initialize();
    const allUsers = await AppDataSource.manager.find(User)
    const userById = await AppDataSource.manager.findOneBy(User, {
        id: 1,
    })
    await AppDataSource.manager.save(userById)

    // Create
    const newUser = await AppDataSource.manager.create(User, { name: "Alice", email: "alice@example.com" });
    await AppDataSource.manager.save(newUser);
    console.log("Saved user:", newUser);

    // Read all
    const allUsers = await AppDataSource.manager.find(User)
    console.log("All users:", allUsers);

    // Read one by id
    const user = await AppDataSource.manager.findOneBy(User, { id: 1 });
    console.log("User 1:", user);

    // Update
    await AppDataSource.manager.update(User, { name: "Alice Updated" });

    // Delete
    await AppDataSource.manager.delete(User, 1);
}

main();
```

2. Repository 仓库就像EntityManager一样，但其操作仅限于具体实体。通过生成的数据源实例 getRepository 方法可以获取到 Repository 实例。

```ts
// 建立连接成功后,在这里可以对数据库进行curd操作
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
// 使用实体管理者时每次调用方法都是需要传入实体类，而 Repository 则不需要。
export async function crudUser () {
  console.log("user crud")
  // 通过实体管理者操作数据库的crud,一般不用这个方法
  // const userManager = await AppDataSource.manager.find(User)
  // 使用仓库-它是一个仓库对象-之后的方法和实体查询者一样的方法
  const userRepository = await AppDataSource.getRepository(User)

  // Create
  const newUser = userRepository.create({ firstName: "Alice", lastName: "Smith",isActive:true });
  await userRepository.save(newUser);
  console.log("Saved user:", newUser);

  // Read all
  const allUsers = await userRepository.find();
  console.log("All users:", allUsers);

  // Read one by id
  const user = await userRepository.findOneBy({ id: 1 });
  console.log("User 1:", user);

  // Update
  await userRepository.update(1, { firstName: "Alice Updated" });

  // Delete
  await userRepository.delete(1)  
}

```

## 3.3 常见查询方法

对于日常开发中,我们一般会使用仓库的方法来操作数据库,基本能实现80%的查询需求。而如果需要更复杂的查询,则需要使用 QueryBuilder 来构建查询。QueryBuilder 是 TypeORM 提供的一种构建查询的工具,它允许我们以一种类型安全的方式构建任何复杂的查询。它可以通过：DataSource、EntityManager、Repository 三种方法来创建。

| 方法                     | 功能                                     | 示例                                                                 |
| ------------------------ | ---------------------------------------- | -------------------------------------------------------------------- |
| `find()`               | 查询多条记录，支持条件、排序、分页、关系 | `repo.find({ where: { status: "active" }, order: { id: "ASC" } })` |
| `findOne()`            | 查询单条记录                             | `repo.findOne({ where: { id: 1 }, relations: ["profile"] })`       |
| `findBy()`             | 简单条件查询                             | `repo.findBy({ age: MoreThan(18) })`                               |
| `findOneBy()`          | 简单条件查单条                           | `repo.findOneBy({ email: "test@example.com" })`                    |
| `save()`               | 插入或更新（存在则更新）                 | `repo.save({ id: 1, name: "newName" })`                            |
| `insert()`             | 批量插入，性能好                         | `repo.insert([{ name: "A" }, { name: "B" }])`                      |
| `update()`             | 根据条件更新                             | `repo.update({ id: 1 }, { name: "updated" })`                      |
| `delete()`             | 根据条件删除                             | `repo.delete({ id: 1 })`                                           |
| `count()`              | 统计记录数                               | `repo.count({ where: { status: "published" } })`                   |
| `createQueryBuilder()` | 返回 QueryBuilder（进入灵活模式）        | `repo.createQueryBuilder("user")`                                  |

```ts
// 通过数据源实例获取 QueryBuilder
const queryBuilder = AppDataSource.createQueryBuilder("user")
const user = await AppDataSource
    .createQueryBuilder()
    .select("user")
    .from(User, "user")
    .where("user.id = :id", { id: 1 })
    .getOne()

// 通过实体管理者获取 QueryBuilder
const queryBuilder2 = AppDataSource.manager.createQueryBuilder("user")
const user = await AppDataSource.manager
    .createQueryBuilder(User, "user")
    .where("user.id = :id", { id: 1 })
    .getOne()

// 通过仓库获取 QueryBuilder
const queryBuilder3 = AppDataSource.getRepository(User).createQueryBuilder("user")
const user = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")
    .where("user.id = :id", { id: 1 })
    .getOne()

  
const firstUser = await AppDataSource
    .getRepository(User)
    .createQueryBuilder("user")// 传入别名user
    .where("user.id = :id", { id: 1 })
    .getOne()

// 等价sql
SELECT
    user.id as userId,
    user.firstName as userFirstName,
    user.lastName as userLastName
FROM users user
WHERE user.id = 1

// 其它太过复杂的查询
// 1. 复杂 WHERE 条件（子查询、原始 SQL）
const qb = repo.createQueryBuilder("user")
  .where("user.age > :age", { age: 18 })
  .andWhere("user.name IN (:...names)", { names: ["Alice", "Bob"] })
  .orWhere("user.email LIKE :email", { email: "%@gmail.com" });

// 2. 多表关联 + 字段筛选
qb.leftJoinAndSelect("user.posts", "post")
  .addSelect("COUNT(post.id)", "postCount")
  .groupBy("user.id");

// 3. 子查询
const subQuery = subRepo.createQueryBuilder("sub")
  .select("MAX(sub.createdAt)")
  .where("sub.userId = user.id");
qb.andWhere(`user.createdAt > (${subQuery.getQuery()})`);

// 4. 聚合函数 + 原生结果（getRawMany）
const raw = await qb.select("user.name, AVG(user.score) as avgScore")
  .groupBy("user.name")
  .getRawMany();

// 5. 复杂分页 + 排序 + 动态条件拼接
if (keyword) {
  qb.andWhere("user.name LIKE :keyword", { keyword: `%${keyword}%` });
}
qb.skip(offset).take(limit).orderBy("user.id", "DESC");

// 6. 更新/删除时使用子查询或连接
await repo.createQueryBuilder()
  .update(User)
  .set({ status: "inactive" })
  .where("id IN (SELECT userId FROM posts WHERE isDeleted = true)")
  .execute();

```

## 3.3 表关系实现

使用typeorm 实现 一对一,一对多,多对多关系的查询。TypeORM 是把表、字段、表和表的关系映射成 Entity 的 class、属性、Entity 之间的关系，那如何映射这种一对一、一对多、多对多的关系呢？还是通过装饰器来指定的。而且在使用关系装饰器时，TypeORM 默认会自动创建数据库物理外键约束（前提是数据库引擎支持 InnoDB，且 synchronize: true 或执行迁移）。

### 1 一对一关系(OneToOne)

TypeORM 里一对一关系的映射通过 @OneToOne 装饰器来声明，维持外键列的 Entity 实体添加 @JoinColumn 装饰器。如果是非外键列的 Entity，想要关联查询另一个 Entity，则需要通过第二个参数指定外键列是另一个 Entity 的哪个属性。

**这里以用户和身份证表为例**

```ts
// user.ts
// 1. 引入需要的装饰器
import { Entity, PrimaryGeneratedColumn, Column,OneToOne  } from 'typeorm'
// 2. 声明实体类
@Entity()
export class User {
    @PrimaryGeneratedColumn({
        comment: '这是 id' // comment-添加注释
    })
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    isActive: boolean

    // 想访问关联的idCard 同样需要添加一个 @OneToOne 装饰器
    // 第一个参数返回值是一个实体类，代表当前实体关联的实体类 
    // 传入第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。
    @OneToOne(() => IdCard, idCard => idCard.user)
    idCard:IdCard
}
// id_card.ts
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm"
// 引入主表
import { User } from "../User"

@Entity({
    name: 'id_card'
})
export class IdCard {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        length: 50,
        comment: '身份证号'
    })
    cardName: string

    // @JoinColumn 装饰器指定外键列在从表即 IdCard 对应的表里维护
    // @OneToOne 装饰器指定一对一的关联关系,可以传入第二个配置参数对象指定更新或删除是的行为
    // 默认还是 restrict 
    // 数据库字段会自动拼接 Id,即变成 userId
    @JoinColumn()
    @OneToOne(() => User,{
        cascade: true, // 这个 cascade 不是数据库的那个级联，而是告诉 typeorm 当你增删改一个 Entity 的时候，是否级联增删改它关联的 Entity。
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
    })
    user: User
}

const user = new User();
user.firstName = '藏';
user.lastName = '青安';
user.isActive = false;
user.id = 1;

const idCard = new IdCard();
idCard.cardName = '450821199508033277';
idCard.user = user;
await AppDataSource.manager.save(idCard);

// 查询-不指定关联关系查不出数据
const idc1 = await AppDataSource.manager.find(IdCard)
console.log('idc',idc1);
// idc [
//   IdCard { id: 2, cardName: '450821199508033277' },
//   IdCard { id: 3, cardName: '11112555666666' }
// ]

// 关联查询
const idc2 = await AppDataSource.manager.find(IdCard,{
   relations:{
       user:true
   }
})
console.log('idc2',idc2);
// idc2 [
//   IdCard {
//     id: 2,
//     cardName: '450821199508033277',
//     user: User { id: 1, firstName: '藏', lastName: '青安', isActive: false }
//   },
//   IdCard {
//     id: 3,
//     cardName: '11112555666666',
//     user: User { id: 2, firstName: '张', lastName: '三丰', isActive: false }
//   }
// ]


// 使用 query builder
const idc3 = await AppDataSource.manager.createQueryBuilder(IdCard,'idc')
   .leftJoinAndSelect('idc.user','user')// 第一个参数是关联从表外键，第二个参数是关联主表的别名
   .getMany()
console.log('idc3',idc3);
// idc3 [
//   IdCard {
//     id: 2,
//     cardName: '450821199508033277',
//     user: User { id: 1, firstName: '藏', lastName: '青安', isActive: false }
//   },
//   IdCard {
//     id: 3,
//     cardName: '11112555666666',
//     user: User { id: 2, firstName: '张', lastName: '三丰', isActive: false }
//   }
// ]


const idc4 = await AppDataSource.manager.getRepository(IdCard)
   .createQueryBuilder("idc")// 给IdCard仓库起别名为 'idc'
   .leftJoinAndSelect("idc.user", "u")
   .getMany();
console.log('idc4',idc4);
// idc4 [
//   IdCard {
//     id: 2,
//     cardName: '450821199508033277',
//     user: User { id: 1, firstName: '藏', lastName: '青安', isActive: false }
//   },
//   IdCard {
//     id: 3,
//     cardName: '11112555666666',
//     user: User { id: 2, firstName: '张', lastName: '三丰', isActive: false }
//   }
// ]

// 从上面可以看出从表是可以查出主表的数据，但是主表查不到从表的数据。如果需要主表也查出从表的数据也需要 @OneToOne 的装饰器,而且需要传入第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。
// @OneToOne(() => IdCard, idCard => idCard.user)
// idCard:IdCard

const user = await AppDataSource.manager.find(User, {
    relations: {
        idCard: true
    }
});
console.log(user);


```

### 2 一对多、多对一关系(OneToMany、ManyToOne)

一对多关系,在多的一方通过使用 @ManyToOne() 装饰器,比一对一简单了不再需要 @JoinColumn 因为一对多的关系只可能是在多的那一方保存外键,不过一对多关系更多还是在一的那一方来保持关系,这时需要一个 @OneToMany()  装饰器并同样要通过第二个参数指定外键列在哪张表维护。

```js
// Department 和 Employee 两个实体
// department.ts
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm"
import { Employee } from "../Employee/index"

@Entity()
export class Department {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    departmentName: string;

    // 一个部门有多个员工，第二个参数指定外键列在 employee.department 维护。
    @OneToMany(type => Employee, employee => employee.department)
    employees: Employee[];
}
// employee.ts
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm"
// 引入部门实体
import { Department } from "../Department"

@Entity()
export class Employee {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 50
    })
    employeeName: string;

    // 声明多对一关系,同样可以传入第二个参数配置
    @ManyToOne(type => Department,{cascade:true,onDelete:'CASCADE'})

    department:Department
}
// 查询
const deps = await AppDataSource.manager.find(Department);
console.log(deps);
// [
//   Department { id: 1, departmentName: '技术部' },
//   Department { id: 2, departmentName: '销售部' },
//   Department { id: 3, departmentName: '行政部' }
// ]
const employees = await AppDataSource.manager.find(Employee);
console.log(employees);
// [
//   Employee { id: 1, employeeName: '张三' },
//   Employee { id: 2, employeeName: '李四' },
//   Employee { id: 3, employeeName: '王五' }
// ]
// 关联查询
const depsRelation = await AppDataSource.manager.find(Department,{
   relations:{
       employees:true
   }
});
console.log(depsRelation);
// [
//   Department {
//     id: 1,
//     departmentName: '技术部',
//     employees: [ [Employee], [Employee], [Employee] ]
//   },
//   Department { id: 2, departmentName: '销售部', employees: [] },
//   Department { id: 3, departmentName: '行政部', employees: [] }
// ]

// query builder
const depsRelation2 = await AppDataSource.manager.createQueryBuilder(Department,'dep')
   .leftJoinAndSelect('dep.employees','emp')
   .getMany();
console.log(depsRelation2); 
// [
//   Department {
//     id: 1,
//     departmentName: '技术部',
//     employees: [ [Employee], [Employee], [Employee] ]
//   },
//   Department { id: 2, departmentName: '销售部', employees: [] },
//   Department { id: 3, departmentName: '行政部', employees: [] }
// ]

const depsRelation3 = await AppDataSource.manager.getRepository(Department)
   .createQueryBuilder("dep")
   .leftJoinAndSelect("dep.employees", "emp")
   .getMany();
console.log(depsRelation3); 
// [
//   Department {
//     id: 1,
//     departmentName: '技术部',
//     employees: [ [Employee], [Employee], [Employee] ]
//   },
//   Department { id: 2, departmentName: '销售部', employees: [] },
//   Department { id: 3, departmentName: '行政部', employees: [] }
// ]

// 从多的一方时能显示一的一方的数据的,因为它只有一条.
const employeesRelation = await AppDataSource.manager.find(Employee,{
   relations:{
       department:true
   }
});
console.log(employeesRelation);
// [
//   Employee {
//     id: 1,
//     employeeName: '张三',
//     department: Department { id: 1, departmentName: '技术部' }
//   },
//   Employee {
//     id: 2,
//     employeeName: '李四',
//     department: Department { id: 1, departmentName: '技术部' }
//   },
//   Employee {
//     id: 3,
//     employeeName: '王五',
//     department: Department { id: 1, departmentName: '技术部' }
//   }
// ]

```

### 3 多对多关系(ManyToMany)

多对多关系,需要一个中间表实现,相当于把多对多拆成了两个一对多,通过 @ManyToMany 装饰器关联,@JoinTable指定中间表名字,另一边需要也是一样的增加一个 @ManyToMany 的映射属性,并且都需要传入第二个属性指明是那个实体的属性,因为外键是存在中间表的。

```ts
import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Tag } from "../Tag";

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100,
        comment: '文章标题'
    })
    title: string;

    @Column({
        type: 'text',
        comment: '文章内容'
    })
    content: string;

    // @JoinTable 指定中间表,可以传入一个配置对象声明中间表的表名、@JoinTable({ name: 'article_tag' })
    // @ManyToMany 声明多对多关系
    @JoinTable()
    @ManyToMany(() => Tag,tag => tag.articles)
    tags: Tag[];
}

import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm"
import { Article } from "../Article"

@Entity()
export class Tag {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 100
    })
    name: string;

    @ManyToMany(type => Article, article => article.tags)
    articles: Article[];
}
// 初始化数据
const a1 = new Article();
a1.title = '深空彼岸';
a1.content = '是否接受甲方为';

const a2 = new Article();
a2.title = '雷阵雨';
a2.content = '是个家里睡觉了估计';

const t1 = new Tag();
t1.name = '天气';

const t2 = new Tag();
t2.name = '生活';

const t3 = new Tag();
t3.name = '小说';

a1.tags = [t1,t2];
a2.tags = [t1,t2,t3];

const entityManager = AppDataSource.manager;

await entityManager.save(t1);
await entityManager.save(t2);
await entityManager.save(t3);

await entityManager.save(a1);
await entityManager.save(a2);

// 查询
const article1 = await AppDataSource.manager.find(Article);
console.log(article1);
// [
//   Article { id: 1, title: '深空彼岸', content: '是否接受甲方为' },
//   Article { id: 2, title: '雷阵雨', content: '是个家里睡觉了估计' }
// ]

const article2 = await AppDataSource.manager.find(Article, {
   relations: {
       tags: true
   }
});
console.log(article2);
// [
//   Article {
//     id: 1,
//     title: '深空彼岸',
//     content: '是否接受甲方为',
//     tags: [ [Tag], [Tag] ]
//   },
//   Article {
//     id: 2,
//     title: '雷阵雨',
//     content: '是个家里睡觉了估计',
//     tags: [ [Tag], [Tag], [Tag] ]
//   }
// ]


const tags1 = await AppDataSource.manager.find(Tag);
console.log(tags1);
// [
//   Tag { id: 1, name: '天气' },
//   Tag { id: 2, name: '生活' },
//   Tag { id: 3, name: '小说' }
// ]

const tags2 = await AppDataSource.manager.find(Tag, {
   relations: {
       articles: true
   }
});
console.log(tags2);
// [
//   Tag { id: 1, name: '天气', articles: [ [Article], [Article] ] },
//   Tag { id: 2, name: '生活', articles: [ [Article], [Article] ] },
//   Tag { id: 3, name: '小说', articles: [ [Article] ] }
// ]


// query builder
const article3 = await AppDataSource.manager.createQueryBuilder(Article, 'article')
   .leftJoinAndSelect('article.tags', 'tag')
   .getMany();
console.log(article3);
// [
//   Article {
//     id: 1,
//     title: '深空彼岸',
//     content: '是否接受甲方为',
//     tags: [ [Tag], [Tag] ]
//   },
//   Article {
//     id: 2,
//     title: '雷阵雨',
//     content: '是个家里睡觉了估计',
//     tags: [ [Tag], [Tag], [Tag] ]
//   }
// ]

const tags3 = await AppDataSource.manager.createQueryBuilder(Tag, 'tag')
   .leftJoinAndSelect('tag.articles', 'article')
   .getMany();
console.log(tags3);
// [
//   Tag { id: 1, name: '天气', articles: [ [Article], [Article] ] },
//   Tag { id: 2, name: '生活', articles: [ [Article], [Article] ] },
//   Tag { id: 3, name: '小说', articles: [ [Article] ] }
// ]


const article4 = await AppDataSource.manager.getRepository(Article)
   .createQueryBuilder("article")
   .leftJoinAndSelect("article.tags", "tag")
   .getMany();
console.log(article4);
const tags4 = await AppDataSource.manager.getRepository(Tag)
   .createQueryBuilder("tag")
   .leftJoinAndSelect("tag.articles", "article")
   .getMany();
console.log(tags4);


```

# 四、迁移 migrations

## 4.1 概述

在我们学习时基于 TypeORM 操作数据库都是开启了 synchronize，只要创建或者修改了 Entity，那就会自动创建表和修改表结构。但是在生产环境下，用 synchronize 很危险，很容易丢数据。

迁移就只是一个带有 SQL 查询的文件，用于更新数据库架构并将新更改应用于现有数据库。TypeORM 提供了一个可以编写此类 SQL 查询并在需要时运行它们的位置。这个位置就叫"migrations"。

迁移是 数据库结构版本管理 的工具，它可以：

1. 跟踪实体定义与数据库表结构的差异
2. 生成可执行的 SQL 脚本，安全地更新表结构（增加列、修改类型、创建索引等）
3. 实现版本化控制，支持升级/回滚
4. 禁止在生产环境使用 synchronize: true，迁移是其替代方案

以下命令均需在项目中配合 `-d ./data-source.ts` 参数使用（或通过 `package.json` 脚本封装）。

* migration:create：生成空白 migration 文件
* migration:generate：连接数据库，根据 Entity 和数据库表的差异，生成 migration 文件
* migration:run：执行 migration，会根据数据库 migrations 表的记录来确定执行哪个(会生成migrations表)
* migration:revert：撤销上次 migration，删掉数据库 migrations 里的上次执行记录

| 命令                   | 作用                                                                         | 示例                                                                             |
| ---------------------- | ---------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `migration:create`   | 创建一个**空白**迁移文件（手动编写 SQL）                               | `typeorm migration:create ./src/migrations/ManualMigration`                    |
| `migration:generate` | **自动比较**实体与数据库的差异，生成包含 `up`/`down`SQL 的迁移文件 | `typeorm migration:generate -d ./data-source.ts ./src/migrations/AddAgeColumn` |
| `migration:run`      | 执行所有**尚未运行**的迁移（按文件名顺序）                             | `typeorm migration:run -d ./data-source.ts`                                    |
| `migration:revert`   | 回滚**最后一次**执行的迁移（调用其 `down`方法）                      | `typeorm migration:revert -d ./data-source.ts`                                 |
| `migration:show`     | 列出所有迁移及其状态（是否已执行）                                           | `typeorm migration:show -d ./data-source.ts`                                   |

**创建新的迁移文件**

```ts
// 1.初始化项目与配置数据源
// data-source.ts
import { DataSource } from "typeorm";
import { User } from "./entities/User";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "password",
  database: "test",
  logging: true,
  entities: [User],            // 实体路径
  synchronize: false,          // 重要：生产必须 false
  migrations: ["src/migrations/*.ts"],   // 迁移文件输出目录
  migrationsTableName: "migrations",     // 记录迁移历史的表名
});

// 在 package.json 中添加脚本
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "ts-node src/index.ts",
    "typeorm": "typeorm-ts-node-commonjs",
    "migration:create": "typeorm-ts-node-commonjs migration:create src/migrations/init",
    "migration:generate": "typeorm-ts-node-commonjs migration:generate src/migrations/GenerateMigration -d ./src/data-source.ts",
    "migration:run": "typeorm-ts-node-commonjs migration:run -d ./src/data-source.ts",
    "migration:revert": "typeorm-ts-node-commonjs migration:revert -d ./src/data-source.ts"

  },

// 迁移文件
import { MigrationInterface, QueryRunner } from "typeorm"

export class Init.ts1781514434783 implements MigrationInterface {
    // up必须包含执行迁移所需的代码
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "title" RENAME TO "name"`);
    }
    // down必须恢复任何up改变，用来回滚迁移文件
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" ALTER COLUMN "name" RENAME TO "title"`); // 恢复"up"方法所做的事情
    }
    // 在up和down里面有一个QueryRunner对象。使用此对象执行所有数据库操作。

}


```

## 4.2 nestjs中使用

1. 创建 data-source.ts 供 migration 用
2. 把 synchronize 关掉
3. 用 migration:generate 生成创建表的 migration
4. 用 migration:run 执行，会根据数据库 migrations 表的记录来确定执行哪个
5. 用 migration:create 创建 migration，然后填入数据库导出的 sql 里的 insert into 语句
6. 用 migration:run 执行
7. 用 migration:generate 生成修改表的 migration
8. 用 migration:run 执行
9. 如果需要用 migration:revert 撤销上次 migration

# 五、集成到nestjs

根据typeorm包的使用方法，在nestjs中使用不过是把 TypeORM 的 api 封装一层，做成一个 TypeOrmModule 使用而已。

我们可以通过定义一个异步提供者，用于实例化 TypeORM 数据源对象。

然后使用仓库模式使用具体的typeorm实体。所以可以再创建一个 Repository 提供者：

而这些功能都由 @nestjs/typeorm 包提供。

```ts
import { DataSource } from 'typeorm';

export const databaseProviders = [
 {
   provide: 'DATA_SOURCE',
   useFactory: async () => {
     const dataSource = new DataSource({
       type: 'mysql',
       host: 'localhost',
       port: 3306,
       username: 'root',
       password: 'root',
       database: 'test',
       entities: [
           __dirname + '/../**/*.entity{.ts,.js}',
       ],
       synchronize: true,
     });

     return dataSource.initialize();
   },
 },
];


import { Module } from '@nestjs/common';
import { databaseProviders } from './database.providers';

@Module({
 providers: [...databaseProviders],
 exports: [...databaseProviders],
})
export class DatabaseModule {}




// 使用
import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Photo } from './photo.entity';

@Injectable()
export class PhotoService {
 constructor(
   @Inject('PHOTO_REPOSITORY')
   private photoRepository: Repository<Photo>,
 ) {}

 async findAll(): Promise<Photo[]> {
   return this.photoRepository.find();
 }
}

```
