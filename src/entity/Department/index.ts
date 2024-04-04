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
