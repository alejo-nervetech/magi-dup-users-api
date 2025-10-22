'use strict';

const { Model } = require('sequelize');
const { v6 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Roles extends Model {
        static associate(models) {
            Roles.belongsTo(models.Organizations, {
                foreignKey: 'organizationId',
                as: 'organization',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
            Roles.hasMany(models.Users, {
                foreignKey: 'roleId',
                as: 'users',
                onDelete: 'SET NULL',
                onUpdate: 'CASCADE',
            });
            Roles.hasMany(models.Permissions, {
                foreignKey: 'roleId',
                as: 'permissions',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }

    Roles.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: () => `role_${v6().replace(/[^\w\s]/gi, '')}`,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            organizationId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isDefault: {
                type: DataTypes.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            canBeDeleted: {
                type: DataTypes.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            deletedAt: {
                type: DataTypes.DATE,
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
            modelName: 'Roles',
            tableName: 'Roles',
            timestamps: true,
            paranoid: true,
        }
    );
    return Roles;
};
