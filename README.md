# typeorm-study
TypeORM学习记录，TypeORM 是一个ORM（对象关系模型）框架，它可以运行在 NodeJS、Browser、Cordova、PhoneGap、Ionic、React Native、Expo 和 Electron 平台上，可以与 TypeScript 和 JavaScript (ES5,ES6,ES7,ES8)一起使用。和我们学习的 mongoose 类似的，就是不直接写sql操作数据库而是通过实体类，直接用类似JavaScript代码的代码操作数据库。

# 一、安装依赖

## 1.1 快速开始
使用 TypeORM 的最快方法是使用其 CLI 命令来快速生成启动项目。
首先全局安装：npm install typeorm -g
然后就可以利用typeorm 命令初始化一个typeorm项目：typeorm init --name MyProject --database mysql
其中name参数指定项目的名称，database指定将要使用的数据库。

也可以不全局安装typeorm而使用 npx 命令：npx typeorm@latest init --name MyProject --database mysql

这两种方式效果是一样的都将在MyProject目录中生成一个包含以下文件的新项目:

```js
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




# 二、创建数据库连接
只有在和数据库建立连接后才能与数据库进行交互。在typeorm中最简单和最常用的方法是使用createConnection和createConnections函数。不难看出前者是创建单个连接,后者是创建多个连接然而这两个api已经废弃了。版本迭代发展是很快的要看官网.

在新版本里使用数据源 DataSource 构造函数初始化数据库连接配置对象,然后调用实例方法 initialize() 初始化连接,使用destroy方法关闭连接,但是后端服务器一般是保持运行的则不需要关闭连接。

## 2.1 创建一个新的数据源实例(连接)

一般是声明一个变量接受执行 DataSource 构造函数返回的实例对象并导出,这样需要使用的地方导入这个实例即可. 这个构造函数接受一个配置对象。使用的数据库不同配置对象的配置项也不同,mysql的如下(具体配置可以查看官网即可)

```js
// data-source.ts
// 1. 引入数据源构造函数
import { DataSource } from "typeorm";

// 2. 创建一个数据源实例并导出
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
AppDataSource.initialize()
    .then(() => {
        // 建立连接成功后,在这里可以对数据库进行curd操作
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
```
设置数据源并导出后就可以在任意地方使用只需要引入即可。

# 三、实体

我们使用 typeorm 的初心就是不用编写大量难以维护的 SQL 语句来 curd 数据库,而是通过代码直接操作。
typeorm是orm即对象关系模型,它是把数据库中的一个表抽象为一个JavaScript类,而在写法上一个JavaScript类就是一个js或ts文件. 所以我们可以认为一个实体就是一张数据库表/schema就是一个js/ts文件罢了。

## 3.1 实体定义

实体Entity是由 @Entity 装饰器装饰的一个类,这个类会映射为数据库中的一个表。所以要定义一个实体是很简单的只需要声明一个类并用 @Entity装饰器装饰即可。此时声明的实体类就是一个表,但是数据库中表的列还没声明。

要添加数据库列字段，只需要将要生成的实体属性加上 @Column 装饰器即可,这样被 @Column 装饰器装饰的列就会被添加到对应的表中。数据库中的列类型也是根据你使用的属性类型推断的，例如： number将被转换为integer，string将转换为varchar，boolean转换为bool等。可以给@Column()装饰器传入一个配置对象指定要创建列的配置。

每个数据库表必须具有包含主键的列,所以每个实体也必须至少有一个主键列。在typeorm中使用 @PrimaryColumn 装饰器和 @PrimaryGeneratedColumn装饰器,后者是主键列自动递增生成,@PrimaryGeneratedColumn("uuid") 可以传入一个uuid参数这样就会自动生成一个唯一的字符串id。声明一个实体之后必须在数据源的 entities 选项中注册不然获取不到。

总之我们在原始sql里需要的在typeorm里都有对应的装饰器或者其它的东西一一对应。

```js
user.ts
// 1. 引入实体装饰器
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm'

// 2. 声明实体类
// @Entity 默认生成类名小写的表名、也可以传入一个配置对象指定表名。
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
实体创建好之后数据库中对应的表也就有了,这时对实体的curd操作也就是对表了、要想对实体实现curd等操作需要理解两个东西:EntityManager 和 Repository。
1. EntityManager 实体管理者:它是一个存放实体存储库集合的地方,通过它可以对任意实体进行管理（insert, update, delete, load 等）使用EntityManager你可以操纵应用中的任何实体。我们生成的数据源实例中就有一个对应 EntityManager 的属性 manager。
```js
// 1. 实体管理者
// 1.引入数据源实例对象
import { AppDataSource } from "./data-source"
// 引入实体类
import { User } from "./entity/User"

// 2. 调用实例方法 initialize() 初始化连接
AppDataSource.initialize()
    .then(async () => {
        // 建立连接成功后,在这里可以对数据库进行curd操作
        console.log("Data Source has been initialized!")
        // 通过实体管理者操作数据库的crud
        // 查找--find()方法 相当于select * from user;查找所有。
        // 当然它也可以传入一个配置对象来查找。
        find(User,{
             select: ["firstName", "lastName"],// 查询的列
             relations: ["profile", "photos", "videos"],// 关系需要加载主体
             // 查询实体的简单条件。
             where: { 
                id: In([4, 8]) // id 在 4 和 8 之间
                firstName: "Timber",
                lastName: "Saw"
             },
            //  排序
             order: {
                name: "ASC",
                id: "DESC"
             },
             skip: 5, //  偏移量（分页）
             take: 10, // limit (分页) - 得到的最大实体数。
             cache: true // 启用或禁用查询结果缓存
         });


        const user = await AppDataSource.manager.find(User,)
        console.log('user',user)

        // 新增和修改(指定了 id，那就变成修改)的方式，都可以使用 save 方法
        // 这个方法的作用：如果实体已存在于数据库中，则会更新。 如果该实体尚未存在于数据库中，则将其插入。 
        const newUser = new User()
        newUser.firstName = 'newUser'
        newUser.lastName = 'newUser'
        newUser.isActive = true
        // newUser.id = 1; 指定id就变成修改
        // 新增一条
        await AppDataSource.manager.save(newUser)
        // 批量新增-同样加上id就是批量修改。
        await AppDataSource.manager.save(User, [
           { firstName: 'ccc', lastName: 'ccc', age: 21},
           { firstName: 'ddd', lastName: 'ddd', age: 22},
           { firstName: 'eee', lastName: 'eee', age: 23}
       ]);

        // 新增的另一种方法 insert
        await AppDataSource.manager.insert(User, {
           firstName: "Timber",
           lastName: "Timber"
        });
        // 批量时后面参数是数组
        await AppDataSource.manager.insert(User, [
           {
             firstName: "Foo",
             lastName: "Bar"
           },
           {
             firstName: "Rizz",
             lastName: "Rak"
           }
        ]);

        // 修改的另一种方法
        // 执行 UPDATE user SET firstName = Rizzrak WHERE firstName = Timber
        await AppDataSource.manager.update(User, { firstName: "Timber" }, { firstName: "Rizzrak" });

        // 删除和批量删除用 delete 方法、根据实体 id 或 ids 或其他给定条件删除实体
        await AppDataSource.manager.delete(User, 1);
        await AppDataSource.manager.delete(User, [2,3]);
        await AppDataSource.manager.delete(User, { firstName: "Timber" });

        // 其它常用方法
        // count - 符合指定条件的实体数量。对分页很有用。
        // isActive为false的所有用户
        const notActive1 = await AppDataSource.manager.find(User,{where:{isActive:false}})
        console.log('notActive1',notActive1)
        const notActive2 = await AppDataSource.manager.count(User,{where:{isActive:false}})
        console.log('notActive2',notActive2)

        // findBy - 查找实体的简单条件。
        const users = await AppDataSource.manager.findBy(User, {
           isActive:true
       });
       console.log(users);
        // 查询一条，使用 findOne
        
        // 等等，也可以通过 query 方法使用原生查询、不过复杂查询(涉及到多个表，也就是多个 Entity 的关联查询)一般都是用 query builder。它允许你使用优雅便捷的语法构建 SQL 查询，执行并获得自动转换的实体。
        const users = await AppDataSource.manager.query('select * from user where age in(?, ?)', [21, 22]);
        console.log(users);
        // 创建一个查询器 
        const user = await AppDataSource.manager.createQueryBuilder(User, "user")
            .where("user.id = :id", { id: 1 })
            .getOne();
        console.log('user',user);

        // 多条有关联的数据的增删改都离不开事务-用 transaction 方法包裹开启事务
        await AppDataSource.manager.transaction(async manager => {
             await manager.save(User, {
                 id: 4,
                 firstName: 'eee',
                 lastName: 'eee',
                 age: 20
             });
         });  

 })
 .catch((err) => {
     console.error("Error during Data Source initialization", err)
 })

```

2. Repository 仓库就像EntityManager一样，但其操作仅限于具体实体。通过生成的数据源实例 getRepository 方法可以获取到 Repository 实例。
```js
// 使用实体管理者时每次调用方法都是需要传入实体类，而 Repository 则不需要。
const userRepository = await AppDataSource.manager.getRepository(User)
// console.log('userRepository',userRepository);
const user = await userRepository.findOne({
   where:{
       id:1
   }
})
console.log('user',user);

// 其它方法同上,也就是创建查询器时有不同
const userQuery = await AppDataSource.manager.getRepository(User)
   .createQueryBuilder("user")
   .where("user.id = :id", { id: 1 })
   .getOne();
console.log('userQuery',userQuery);

```


## 3.3 连表查询
使用typeorm 实现 一对一,一对多,多对多关系的查询
TypeORM 是把表、字段、表和表的关系映射成 Entity 的 class、属性、Entity 之间的关系，那如何映射这种一对一、一对多、多对多的关系呢？
还是通过装饰器来指定的
1. 一对一关系,这里还是以用户和身份证表为例。之前是通过在从表中指定的外键来关联，现在通过装饰器来指定这种关系。
TypeORM 里一对一关系的映射通过 @OneToOne 装饰器来声明，维持外键列的 Entity 添加 @JoinColumn 装饰器。如果是非外键列的 Entity，想要关联查询另一个 Entity，则需要通过第二个参数指定外键列是另一个 Entity 的哪个属性。
```js
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

    // @JoinColumn 装饰器指定外键列在当前表即 IdCard 对应的表里维护
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

// 从上面可以看出从表是可以查出主表的数据，但是主表查不到从表的数据。如果需要主表也查出从表的数据也需要 @OneToOne 的装饰器,不过需要传入第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。
// @OneToOne(() => IdCard, idCard => idCard.user)
// idCard:IdCard

const user = await AppDataSource.manager.find(User, {
    relations: {
        idCard: true
    }
});
console.log(user);


```

2. 一对多关系,在多的一方通过使用 @ManyToOne 装饰器,比一对一简单了不再需要 @JoinColumn 因为一对多的关系只可能是在多的那一方保存外键,不过一对多关系更多还是在一的那一方来保持关系,这是需要一个 @OneToMany  装饰器并同样要通过第二个参数指定外键列在 employee.department 维护。
```js
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

    // 声明一对多关系
    @ManyToOne(type => Department)
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

3. 多对多关系,需要一个中间表实现,相当于把多对多拆成了两个一对多,通过 @ManyToMany 装饰器关联,@JoinTable指定中间表名字,另一边需要也是一样的增加一个 @ManyToMany 的映射属性,并且都需要传入第二个属性指明是那个实体的属性,因为外键是存在中间表的
```js
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

    // @JoinTable 指定中间表,可以传入一个配置对象声明@JoinTable({ name: 'article_tag' })
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




# 三、实体

# 三、实体
