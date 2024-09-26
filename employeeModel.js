const { DataTypes } = require('sequelize');
const sequelize = require('../config/tests').sequelize;

const Employee = sequelize.define('Employee', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  position: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
    validate: {
      isEmail: true,
      notEmpty: {
        msg: 'Email cannot be empty if provided.', // Optional but should be valid if given
      },
    },
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      is: /^265\d{9}$/, // Validates Malawian phone format
      notNull: {
        msg: 'Phone number is required.',
      },
      notEmpty: {
        msg: 'Phone number cannot be empty.',
      },
    },
  },
  areaOfResidence: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
  },
  emergencyNumber: {
    type: DataTypes.STRING,
    allowNull: true, // Optional field
    validate: {
      is: /^(\d{3,12})$/, // Ensures the emergency number is between 3-12 digits
    },
  },
  dateJoined: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  expectedWorkdays: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  expectedSalary: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
}, {
  tableName: 'employees',
  timestamps: true,
});

module.exports = Employee;
