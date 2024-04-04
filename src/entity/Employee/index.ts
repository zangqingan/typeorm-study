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

