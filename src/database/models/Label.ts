import { Optional } from 'sequelize';
import sanitizeHtml from 'sanitize-html';
import { Model, Table, Column, DataType, BeforeCreate, BeforeUpdate } from 'sequelize-typescript';

interface LabelAttributes {
  id: number;
  title: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
export interface LabelInput extends Optional<LabelAttributes, 'id'> { }
export interface LabelOuput extends Required<LabelAttributes> { }

@Table({
  timestamps: true,
  tableName: 'labels'
})
class Label extends Model<LabelAttributes, LabelInput> {
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

  @BeforeCreate
  @BeforeUpdate
  static sanitizeData(instance: LabelAttributes) {
    instance.title = sanitizeHtml(instance.title.trim());
  }
}

export default Label;
