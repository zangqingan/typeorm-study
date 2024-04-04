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
    @JoinColumn()
    @OneToOne(() => User)
    user: User
}
