import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn, Unique } from "typeorm"

@Entity()
export class File {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    @Unique(["fileName"])
    fileName: string

    @Column()
    size: string 

    @Column()
    lastModified: Date 

    @CreateDateColumn()
    createdDate: Date;
    
    @UpdateDateColumn()
    updatedDate: Date;
}
