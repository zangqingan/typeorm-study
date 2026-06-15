
// 建立连接成功后,在这里可以对数据库进行curd操作
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { IdCard } from "../entity/IdCard";
import { Department } from "../entity/Department";
import { Employee } from "../entity/Employee";
import { Article } from "../entity/Article";
import { Tag } from "../entity/Tag";

// 用户crud操作
export async function crudUser () {
  console.log("user crud")
  // 通过实体管理者操作数据库的crud,一般不用这个方法
  // const userManager = await AppDataSource.manager.find(User)
  // 使用仓库-它是一个仓库对象-之后的方法和实体查询者一样的方法
  const userRepository = await AppDataSource.getRepository(User)
  const IdCardRepository = await AppDataSource.getRepository(IdCard)

  // Create
  // const newUser = userRepository.create({ firstName: "LI", lastName: "SI",isActive:true });
  // await userRepository.save(newUser);
  // console.log("Saved user:", newUser);
  // const newIdCard1 = IdCardRepository.create({ cardName: "12345678901234567890", user: {id: 2} });
  // const newIdCard2 = IdCardRepository.create({ cardName: "12345678901234567890", user: newUser });
  // await IdCardRepository.save(newIdCard1);
  // await IdCardRepository.save(newIdCard2);


  // // Read all
  // const allUsers = await userRepository.find();
  // console.log("All users:", allUsers);

  // // Read one by id
  // const user = await userRepository.findOneBy({ id: 1 });
  // console.log("User 1:", user);

  // // Update
  // await userRepository.update(1, { firstName: "Alice Updated" });

  // // Delete
  // await userRepository.delete(1)  
}

// 一对一关系查询
export async function OneToOneQuery (userId: number) {
  const userRepository = await AppDataSource.getRepository(User)
  const IdCardRepository = await AppDataSource.getRepository(IdCard)

  const user = await userRepository.find({ where: { id: userId }, relations:  ['idCard'] })
  const idCard = await IdCardRepository.findOne({ where: { id:1 }, relations: ['user'] })
  console.log("User:", user)
  console.log("IdCard:", idCard)
}

/**
 * 一对多关系查询
 * @param depId 部门id
 */
export async function OneToManyQuery (depId: number) {
  const depRepository = await AppDataSource.getRepository(Department)
  const empRepository = await AppDataSource.getRepository(Employee)

  const dep = await depRepository.findOne({ where: { id: depId }, relations: ['employees'] })
  console.log("Department:", dep)

  const employees = await empRepository.find({ where: { id:1 }, relations: ['department'] })
  console.log("Employees:", employees)
  
}


export async function ManyToManyQuery (articleId: number) {
  const articleRepository = await AppDataSource.getRepository(Article)
  const tagRepository = await AppDataSource.getRepository(Tag)

  const article = await articleRepository.findOne({ where: { id: articleId }, relations: ['tags'] })
  console.log("Article:", article)  

  const tags = await tagRepository.find({ where: { id: articleId }, relations: ['articles'] })
  console.log("Tags:", tags)

  const queryArt = await articleRepository.createQueryBuilder('article')
    .leftJoinAndSelect(Tag, 'tag')
    .where('article.id = :articleId', { articleId })
    .getOne()


}
