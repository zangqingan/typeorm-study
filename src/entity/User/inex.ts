// 1. 引入需要的装饰器
import { Entity, PrimaryGeneratedColumn, Column  } from 'typeorm'

// 2. 声明实体类
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column()
    isActive: boolean
}