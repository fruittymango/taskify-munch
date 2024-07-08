import { Optional} from 'sequelize';
import { Model, Table, Column, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Task from './Task.model';
import Comment from './Comment.model';

// Relates a task to the person who it is assigned to
interface CommentAssignmentAttributes {
  id: number;
  commentId: number;
  taskId?: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface CommentAssignmentInput extends Optional<CommentAssignmentAttributes, 'id'> {}
export interface CommentAssignmentOutput extends Required<CommentAssignmentAttributes> {}

@Table({
  timestamps: true,
  tableName: 'comment_assignments'
})
class CommentAssignment extends Model<CommentAssignmentAttributes, CommentAssignmentInput> {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @ForeignKey(() => Comment)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  commentId!: number;

  @ForeignKey(() => Task)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  taskId!: number;

  @BelongsTo(()=>Task, "taskId")
  task!:Task
}

export default CommentAssignment