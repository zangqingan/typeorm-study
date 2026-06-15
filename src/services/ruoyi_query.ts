import { AppDataSource } from "../data-source";
import { SysUser } from '../entities/sys-user.entity';
import { SysDept } from '../entities/sys-dept.entity';
import { SysRole } from '../entities/sys-role.entity';
import { SysUserRole } from '../entities/sys-user-role.entity';
import { SysRoleMenu } from '../entities/sys-role-menu.entity';
import { SysMenu } from '../entities/sys-menu.entity';

/**
 * 根据 userId 查询用户及其部门名称
 * 方法一：两次独立查询
 */
export async function getUserWithDept(userId: number) {
  const userRepository = AppDataSource.getRepository(SysUser);
  const deptRepository = AppDataSource.getRepository(SysDept);

  const user = await userRepository.findOne({ where: { userId } });
  if (!user) return null;
  const dept = await deptRepository.findOne({ where: { deptId: user.deptId } });
  const data = {
    ...user,
    deptName: dept?.deptName
  }
  console.log("data:", data)
  return data;
}

/**
 * 根据 userId 查询用户及其部门名称
 * 方法二：QueryBuilder 一次 JOIN 查询
 * 注意：使用实体属性名（camelCase），TypeORM 会自动映射到数据库 snake_case 列名
 */
export async function getUserWithDeptByJoin(userId: number) {
  const userRepository = AppDataSource.getRepository(SysUser);

  const result = await userRepository
    .createQueryBuilder('u')
    .leftJoin(SysDept, 'd', 'd.deptId = u.deptId')
    // 显式别名：addSelect('别名.实体属性名', '输出key') → getRawOne 输出 camelCase
    .addSelect('u.userId', 'userId')
    .addSelect('u.deptId', 'deptId')
    .addSelect('u.loginName', 'loginName')
    .addSelect('u.userName', 'userName')
    .addSelect('u.userType', 'userType')
    .addSelect('u.email', 'email')
    .addSelect('u.phonenumber', 'phonenumber')
    .addSelect('u.sex', 'sex')
    .addSelect('u.avatar', 'avatar')
    .addSelect('u.password', 'password')
    .addSelect('u.salt', 'salt')
    .addSelect('u.status', 'status')
    .addSelect('u.delFlag', 'delFlag')
    .addSelect('u.loginIp', 'loginIp')
    .addSelect('u.loginDate', 'loginDate')
    .addSelect('u.pwdUpdateDate', 'pwdUpdateDate')
    .addSelect('u.createBy', 'createBy')
    .addSelect('u.createTime', 'createTime')
    .addSelect('u.updateBy', 'updateBy')
    .addSelect('u.updateTime', 'updateTime')
    .addSelect('u.remark', 'remark')
    .addSelect('d.deptName', 'deptName')
    .where('u.userId = :userId', { userId })
    .getRawOne();

  console.log("result:", result);
  return result;
}


/**
 * 根据 userId 查询用户权限
 * @param userId 用户ID
 * @returns 用户权限数组
 */
export async function getUserPermissions(userId: number): Promise<string[]> {
  const menuRepository = AppDataSource.getRepository(SysMenu);
  // 四表关联：user -> user_role -> role_menu -> menu
  const perms = await menuRepository
    .createQueryBuilder('m')
    .innerJoin(SysRoleMenu, 'rm', 'rm.menu_id = m.menu_id')
    .innerJoin(SysUserRole, 'ur', 'ur.role_id = rm.role_id')
    .innerJoin(SysUser, 'u', 'u.user_id = ur.user_id')
    .where('u.user_id = :userId', { userId })
    .andWhere('m.perms IS NOT NULL')
    .andWhere('m.perms != \'\'')
    .select('DISTINCT m.perms', 'perms')
    .getRawMany();
  
  // 提取 perms 字符串数组
  console.log("perms:", perms);
  return perms.map(item => item.perms);
}

export async function getUsersInDeptAndChildren(deptId: number) {
  // 先查出目标部门及其所有子部门的 ID
  const depts = await AppDataSource.getRepository(SysDept)
    .createQueryBuilder('d')
    .where('d.deptId = :deptId', { deptId })
    .orWhere('d.ancestors LIKE :pattern', { pattern: `%,${deptId},%` })
    .getMany();
  const deptIds = depts.map(d => d.deptId);

  // 如果没有匹配的部门，直接返回空数组，避免 IN () 语法错误
  if (deptIds.length === 0) {
    return [];
  }

  // 查询这些部门下的用户
  const users = await AppDataSource.getRepository(SysUser)
    .createQueryBuilder('u')
    .where('u.deptId IN (:...deptIds)', { deptIds })
    .getMany();
  console.log("users:", users);
  return users;
}