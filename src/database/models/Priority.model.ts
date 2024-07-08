import { Optional} from 'sequelize';
import { Model, Table, Column, DataType, HasMany } from 'sequelize-typescript';

interface PriorityAttributes {
  id: number;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface PriorityInput extends Optional<PriorityAttributes, 'id'> {}
export interface PriorityOuput extends Required<PriorityAttributes> {}

@Table({
  timestamps: true,
  tableName: 'priorities',
  paranoid: true
})
class Priority extends Model<PriorityAttributes, PriorityInput>{
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id!: number;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true
  })
  title!: string;
}

export default Priority