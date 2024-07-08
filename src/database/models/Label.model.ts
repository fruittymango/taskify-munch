import { Optional} from 'sequelize';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

// Relates a label to the task it is assigned to
interface LabelAttributes {
  id: number;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface LabelInput extends Optional<LabelAttributes, 'id'> {}
export interface LabelOuput extends Required<LabelAttributes> {}

@Table({
  timestamps: true,
  tableName: 'labels'
})
class Label extends Model<LabelAttributes, LabelInput>  {
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

export default Label;
