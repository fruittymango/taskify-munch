import { HasOne, Optional} from 'sequelize';
import { Model, Table, Column, DataType, HasMany, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import User from './User';
import Priority from './Priority';
import Label from './Label';
import Status from './Status';
import Project from './Project';
import TaskAssignment from './TaskAssignments';
import CommentAssignment from './CommentAssignment';



interface TaskAttributes {
  id: number;
  guid: string;
  title: string;
  statusId?:string;
  dueDate?: Date;
  labelId: number;
  createdBy: number;
  projectId: number;
  priorityId?: number;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface TaskInput extends Optional<TaskAttributes, 'id'> {}
export interface TaskOuput extends Required<TaskAttributes> {}

@Table({
  timestamps: true,
  tableName: 'tasks',
  paranoid: true
})
class Task extends Model<TaskAttributes, TaskInput> {
  @Column ({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number

  @Column({
    type: DataType.UUID,
    allowNull: false
  })
  guid!: string;

  @Column({
    type: DataType.TEXT,
    unique: true,
  })
  title!: string;

  @Column({
    type: DataType.DATE,
  })
  dueDate!: Date;

  @ForeignKey(() => Status)
  @Column({
    type: DataType.INTEGER,
  })
  statusId!: number;

  @ForeignKey(() => Project)
  @Column({
    type: DataType.INTEGER,
    allowNull: false
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
    allowNull: false,
  })
  labelId!: number;

  @Column({
    type: DataType.TEXT,
  })
  description!: string;

  @BelongsTo(()=>Project, 'projectId')
  project!: Project

  @HasMany(()=>User, 'userId')
  user!: User[]

  @HasMany(()=>TaskAssignment)
  task_assignments!: TaskAssignment[] 

  @HasMany(()=>CommentAssignment)
  comment_assignments!: CommentAssignment[] 
}

export default Task