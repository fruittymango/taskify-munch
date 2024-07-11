import { Optional} from 'sequelize';
import { Model, Table, Column, DataType } from 'sequelize-typescript';

// Relates a label to the task it is assigned to
interface StatusAttributes {
  id: number;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface StatusInput extends Optional<StatusAttributes, 'id'> {}
export interface StatusOutput extends Required<StatusAttributes> {}

@Table({
  timestamps: true,
  tableName: 'statuses'
})
class Status extends Model<StatusAttributes, StatusInput>  {
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

export default Status;
