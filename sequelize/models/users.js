'use strict';

const { Model } = require('sequelize');
const { v6 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Users extends Model {
        static associate(models) {
            Users.belongsTo(models.Organizations, {
                foreignKey: 'organizationId',
                as: 'organization',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            Users.belongsTo(models.Roles, {
                foreignKey: 'roleId',
                as: 'role',
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            });
        }
    }

    Users.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: () => `usr_${v6().replace(/[^\w\s]/gi, '')}`,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organizationId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
            },
            deletedAt: {
                type: DataTypes.DATE,
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
            modelName: 'Users',
            tableName: 'Users',
            timestamps: true,
            paranoid: true,
        }
    );
    return Users;
};
