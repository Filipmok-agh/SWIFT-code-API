import { Model, DataTypes } from 'sequelize';
import sequelize from '../db';

class SwiftCode extends Model {
  public swiftCode!: string;
  public bankName!: string;
  public countryISO2!: string;
  public countryName!: string;
  public address!: string;
  public isHeadquarter!: boolean;
}

SwiftCode.init({
  swiftCode: { 
    type: DataTypes.STRING, 
    allowNull: false, 
    primaryKey: true,
    unique: true
  },
  bankName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  countryISO2: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  countryName: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  address: { type: DataTypes.STRING, 
    allowNull: false 
  },
  isHeadquarter: { type: DataTypes.BOOLEAN, 
    allowNull: false 
  },
}, {
  sequelize,
  modelName: 'SwiftCode',
});

export default SwiftCode;
