import { Optional} from 'sequelize';
import { Model, Table, Column, DataType, HasMany, ForeignKey} from 'sequelize-typescript';
import User from './User';

interface CommentAttributes {
  id: number;
  guid: string;
  content: string;
  createdBy: number;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface CommentInput extends Optional<CommentAttributes, 'id'> {}
export interface CommentOuput extends Required<CommentAttributes> {}

@Table({
  timestamps: true,
  tableName: 'comments'
})
class Comment extends Model<CommentAttributes, CommentInput> {
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
  })
  content!: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  createdBy!: number;
  
  // TODO: Figure out the relationships
  @HasMany(()=>User, 'userId')
  users!: User[]
}

export default Comment