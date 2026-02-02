'use strict';

const { Model } = require('sequelize');
const { v6 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class UserDepartments extends Model {
        static associate(models) {
            UserDepartments.belongsTo(models.Users, {
                foreignKey: 'userId',
                as: 'user',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            UserDepartments.belongsTo(models.Roles, {
                foreignKey: 'roleId',
                as: 'role',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }

    UserDepartments.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: () => `udept_${v6().replace(/[^\w\s]/gi, '')}`,
            },
            userId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            departmentId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.STRING,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'id',
                },
            },
            createdAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
            updatedAt: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'UserDepartments',
            tableName: 'UserDepartments',
            timestamps: true,
            indexes: [
                {
                    unique: true,
                    fields: ['userId', 'departmentId'],
                    name: 'unique_user_department',
                },
            ],
        }
    );
    return UserDepartments;
};
