import { DataTypes, Optional } from "sequelize";
import {
    Model,
    DataType,
    Table,
    Column,
    HasMany,
    ForeignKey,
    BelongsTo,
    BeforeCreate,
    BeforeUpdate,
} from "sequelize-typescript";
import User from "./User";
import Priority from "./Priority";
import Label from "./Label";
import Status from "./Status";
import Project from "./Project";
import TaskAssignment from "./TaskAssignments";
import sanitizeHtml from "sanitize-html";

interface TaskAttributes {
    id: number;
    guid: string;
    title: string;
    statusId: number;
    dueDate?: string;
    labelId: number;
    createdBy: number;
    projectId?: number;
    priorityId?: number;
    description?: string;
    createdAt?: Date;
    updatedAt?: Date;
    deletedAt?: Date;
}
export interface TaskInput extends Optional<TaskAttributes, "id"> {}
export interface TaskOuput extends Required<TaskAttributes> {}

@Table({
    timestamps: true,
    tableName: "tasks",
    paranoid: true,
})
class Task extends Model<TaskAttributes, TaskInput> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id!: number;

    @Column({
        type: DataType.UUID,
        allowNull: false,
    })
    guid!: string;

    @Column({
        type: DataType.TEXT,
        unique: true,
    })
    title!: string;

    @Column({
        type: DataTypes.DATEONLY,
    })
    dueDate!: string;

    @ForeignKey(() => Status)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    statusId!: number;

    @ForeignKey(() => Project)
    @Column({
        type: DataType.INTEGER,
    })
    projectId!: number;

    @ForeignKey(() => Priority)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    priorityId!: number;

    @ForeignKey(() => User)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
    })
    createdBy!: number;

    @ForeignKey(() => Label)
    @Column({
        type: DataType.INTEGER,
    })
    labelId!: number;

    @Column({
        type: DataType.TEXT,
    })
    description!: string;

    @BelongsTo(() => Project, "projectId")
    project!: Project;

    @HasMany(() => User, "userId")
    user!: User[];

    @HasMany(() => Status, "statusId")
    status!: Status[];

    @HasMany(() => TaskAssignment)
    task_assignments!: TaskAssignment[];

    @BeforeCreate
    @BeforeUpdate
    static sanitizeData(instance: TaskAttributes) {
        instance.title = sanitizeHtml(instance.title.trim());
        if (instance.description) {
            instance.description = sanitizeHtml(instance.description.trim());
        }
    }
}

export default Task;
