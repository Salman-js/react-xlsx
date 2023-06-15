import { Model, DataTypes, Sequelize } from 'sequelize';

class File extends Model {
  public id!: number;
  public filename!: string;
  public path!: string;

  public static initialize(sequelize: Sequelize): void {
    this.init(
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        filename: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        path: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      {
        sequelize,
        tableName: 'files',
      }
    );
  }
}

export default File;
