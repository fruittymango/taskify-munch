import { Optional} from 'sequelize';
import { Model, Table, Column, DataType, HasMany, ForeignKey, BelongsTo, BelongsToMany } from 'sequelize-typescript';
import Task from './Task';
import TaskAssignment from './TaskAssignments';
import Project from './Project';

interface UserAttributes {
  id: number;
  guid: string;
  name: string;
  surname: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface UserInput extends Optional<UserAttributes, 'id'> {}
export interface UserOuput extends Required<UserAttributes> {}

@Table({
  timestamps: true,
  tableName: 'users',
  paranoid: true
})
class User extends Model<UserAttributes, UserInput>{
  @Column ({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.UUID,
    allowNull: false,
    unique: true,
  })
  guid!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isAlpha: true,
    },
  })
  name!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    validate: {
      isAlpha: true,
    },
  })
  surname!: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  })
  email!: string;
  
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  password!: string;

  @HasMany(() => Project)
  projects!: Project;

  @BelongsToMany(()=>Task, ()=>TaskAssignment)
  tasks!: Task[]

  // @BelongsToMany(()=>Comment, ()=>CommentAssignment)
  // comments!: Comment[]
}
export default User