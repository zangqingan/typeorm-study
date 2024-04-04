// 1. 引入需要的装饰器
import { Entity, PrimaryGeneratedColumn, Column, OneToOne  } from 'typeorm'
import { IdCard } from '../IdCard'

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

    // 传入第二个参数告诉 typeorm，外键是另一个 Entity 的哪个属性。
    @OneToOne(() => IdCard, idCard => idCard.user)
    idCard:IdCard
}