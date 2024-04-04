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
