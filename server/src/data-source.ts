import "reflect-metadata"
import { DataSource } from "typeorm"
import { File } from "./entity/File"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "test",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [File],
    migrations: [],
    subscribers: [],
})
