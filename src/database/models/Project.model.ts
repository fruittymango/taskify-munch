import { Optional} from 'sequelize';
import { Model, Table, Column, DataType, HasMany, ForeignKey, BelongsTo } from 'sequelize-typescript';
import Task from './Task.model';
import User from './User.model';

interface ProjectAttributes {
  id: number;
  guid: string;
  title: string;
  description: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface ProjectInput extends Optional<ProjectAttributes, 'id'> {}
export interface BoardOuput extends Required<ProjectAttributes> {}

@Table({
  timestamps: true,
  tableName: 'project'
})
class Project extends Model<ProjectAttributes, ProjectInput>{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true
  })
  guid!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  title!: string;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
    unique: true
  })
  description!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  userId!: number;

  @BelongsTo(() => User, 'userId')
  user!: User;

  @HasMany(()=>Task, 'taskId')
  task!:Task[]
}

export default Project