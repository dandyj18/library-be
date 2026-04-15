'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Borrowings extends Model {
    static associate(models) {
      Borrowings.belongsTo(models.Member, {
        foreignKey: 'member_id',
        as: 'member',
      });

      Borrowings.belongsTo(models.Book, {
        foreignKey: 'book_id',
        as: 'book',
      });
    }
  }

  Borrowings.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Members',
          key: 'id',
        },
      },
      book_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Books',
          key: 'id',
        },
      },
      borrow_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      return_date: {
        type: DataTypes.DATEONLY,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: 'Borrowings',
      timestamps: true,
    }
  );

  return Borrowings;
};