import { Entity,PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Photo {
    @PrimaryGeneratedColumn({
        comment: '这是 id' // comment-添加注释
    })
    id: number
}