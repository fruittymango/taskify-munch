import { Optional } from "sequelize";
import sanitizeHtml from "sanitize-html";

import {
    Model,
    Table,
    Column,
    DataType,
    BeforeCreate,
    BeforeUpdate,
} from "sequelize-typescript";

interface PriorityAttributes {
    id: number;
    title: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface PriorityInput extends Optional<PriorityAttributes, "id"> {}
export interface PriorityOuput extends Required<PriorityAttributes> {}

@Table({
    timestamps: true,
    tableName: "priorities",
    paranoid: true,
})
class Priority extends Model<PriorityAttributes, PriorityInput> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    title!: string;

    @BeforeCreate
    @BeforeUpdate
    static sanitizeData(instance: PriorityAttributes) {
        instance.title = sanitizeHtml(instance.title.trim());
    }
}

export default Priority;
