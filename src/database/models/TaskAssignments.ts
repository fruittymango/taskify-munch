import { Optional} from 'sequelize';
import { Model, Table, Column, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import User from './User';
import Task from './Task';
interface TaskAssignmentAttributes {
  id: number;
  userId: number;
  taskId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface TaskAssignmentInput extends Optional<TaskAssignmentAttributes, 'id'> {}
export interface TaskAssignmentOutput extends Required<TaskAssignmentAttributes> {}

@Table({
  timestamps: true,
  tableName: 'task_assignments',
  paranoid: true 
})
class TaskAssignment extends Model<TaskAssignmentAttributes, TaskAssignmentInput> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  taskId!: number;

  @BelongsTo(()=>Task, "taskId")
  tasks!:Task
}

export default TaskAssignment