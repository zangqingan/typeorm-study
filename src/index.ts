// 1.引入数据源实例对象
import { AppDataSource } from "./data-source"
// 引入实体类
import { User } from "./entity/User"
import { IdCard } from "./entity/IdCard"
import { Department } from "./entity/Department"
import { Employee } from "./entity/Employee"
import { Tag } from "./entity/Tag"
import { Article } from "./entity/Article"

// 2. 调用实例方法 initialize() 初始化连接
AppDataSource.initialize()
    .then(async () => {
        // 建立连接成功后,在这里可以对数据库进行curd操作
        console.log("Data Source has been initialized!")
        // 通过实体管理者操作数据库的crud
        // 查找--find()方法 相当于select * from user;查找所有。
        // const user = await AppDataSource.manager.find(User)
        // console.log('user',user)
        // // 新增和修改(指定了 id，那就变成修改)的方式，都可以使用 save 方法
        // const newUser = new User()
        // newUser.firstName = 'newUser'
        // // newUser.id = 1; 指定id就变成修改
        // newUser.lastName = 'newUser'
        // newUser.isActive = true
        // await AppDataSource.manager.save(newUser)
        // // isActive为false的所有用户
        // const notActive1 = await AppDataSource.manager.find(User,{where:{isActive:false}})
        // console.log('notActive1',notActive1)
        // const notActive2 = await AppDataSource.manager.count(User,{where:{isActive:false}})
        // console.log('notActive2',notActive2)
        // 查询isActive为true的所有用户
        // const users = await AppDataSource.manager.findBy(User, {
        //     isActive:true
        // });
        // console.log(users);

        // 复杂查询一般创建查询器
        // const user = await AppDataSource.manager.createQueryBuilder(User, "user")
        //     .where("user.id = :id", { id: 1 })
        //     .getOne();
        // console.log('user',user);

        // 使用仓库-它是一个仓库对象-之后的方法和实体查询者一样的
        // const userRepository = await AppDataSource.manager.getRepository(User)
        // // console.log('userRepository',userRepository);
        // const user = await userRepository.findOne({
        //     where:{
        //         id:1
        //     }
        // })
        // console.log('user',user);

        // 创建查询器
        // const userQuery = await AppDataSource.manager.getRepository(User)
        //     .createQueryBuilder("user")
        //     .where("user.id = :id", { id: 1 })
        //     .getOne();
        // console.log('userQuery',userQuery);

        // 一对一关系
        // const user = new User();
        // user.firstName = '藏';
        // user.lastName = '青安';
        // // user.isActive = false;
        // user.id = 2;
        
        // const idCard = new IdCard();
        // idCard.cardName = '11112555666666';
        // idCard.user = user;
        // await AppDataSource.manager.save(idCard);

        // // 查询-不指定关联关系查不出数据
        // const idc1 = await AppDataSource.manager.find(IdCard)
        // console.log('idc',idc1);
        // // 关联查询
        // const idc2 = await AppDataSource.manager.find(IdCard,{
        //     relations:{
        //         user:true
        //     }
        // })
        // console.log('idc2',idc2);

        // // 使用 query builder
        // const idc3 = await AppDataSource.manager.createQueryBuilder(IdCard,'idc')
        //     .leftJoinAndSelect('idc.user','user')
        //     .getMany()
        // console.log('idc3',idc3);

        // const idc4 = await AppDataSource.manager.getRepository(IdCard)
        //     .createQueryBuilder("idc")// 给IdCard仓库起别名为 'idc'
        //     .leftJoinAndSelect("idc.user", "u")
        //     .getMany();
        // console.log('idc4',idc4);

        // 一对多关系
        // 查询
        // const deps = await AppDataSource.manager.find(Department);
        // console.log(deps);
        // const employees = await AppDataSource.manager.find(Employee);
        // console.log(employees);

        // // 关联查询
        // const depsRelation = await AppDataSource.manager.find(Department,{
        //     relations:{
        //         employees:true
        //     }
        // });
        // console.log(depsRelation);

        // // query builder
        // const depsRelation2 = await AppDataSource.manager.createQueryBuilder(Department,'dep')
        //     .leftJoinAndSelect('dep.employees','emp')
        //     .getMany();
        // console.log(depsRelation2); 

        // const depsRelation3 = await AppDataSource.manager.getRepository(Department)
        //     .createQueryBuilder("dep")
        //     .leftJoinAndSelect("dep.employees", "emp")
        //     .getMany();
        // console.log(depsRelation3); 
    
        // const employeesRelation = await AppDataSource.manager.find(Employee,{
        //     relations:{
        //         department:true
        //     }
        // });
        // console.log(employeesRelation);

        // 多对多关系
        // const a1 = new Article();
        // a1.title = '深空彼岸';
        // a1.content = '是否接受甲方为';
    
        // const a2 = new Article();
        // a2.title = '雷阵雨';
        // a2.content = '是个家里睡觉了估计';
    
        // const t1 = new Tag();
        // t1.name = '天气';
    
        // const t2 = new Tag();
        // t2.name = '生活';
    
        // const t3 = new Tag();
        // t3.name = '小说';
    
        // a1.tags = [t1,t2];
        // a2.tags = [t1,t2,t3];
    
        // const entityManager = AppDataSource.manager;
    
        // await entityManager.save(t1);
        // await entityManager.save(t2);
        // await entityManager.save(t3);
    
        // await entityManager.save(a1);
        // await entityManager.save(a2);

        // 查询
        const article1 = await AppDataSource.manager.find(Article);
        console.log(article1);
        const article2 = await AppDataSource.manager.find(Article, {
            relations: {
                tags: true
            }
        });
        console.log(article2);

        const tags1 = await AppDataSource.manager.find(Tag);
        console.log(tags1);
        const tags2 = await AppDataSource.manager.find(Tag, {
            relations: {
                articles: true
            }
        });
        console.log(tags2);

        // query builder
        const article3 = await AppDataSource.manager.createQueryBuilder(Article, 'article')
            .leftJoinAndSelect('article.tags', 'tag')
            .getMany();
        console.log(article3);
        const tags3 = await AppDataSource.manager.createQueryBuilder(Tag, 'tag')
            .leftJoinAndSelect('tag.articles', 'article')
            .getMany();
        console.log(tags3);

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

        
        

    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })