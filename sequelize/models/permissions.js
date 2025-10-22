'use strict';

const { Model } = require('sequelize');
const { v6 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Permissions extends Model {
        static associate(models) {
            Permissions.belongsTo(models.Roles, {
                foreignKey: 'roleId',
                as: 'role',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }

    Permissions.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: () => `perm_${v6().replace(/[^\w\s]/gi, '')}`,
                allowNull: false,
            },
            roleId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            resource: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            accessType: {
                type: DataTypes.ENUM('R', 'W'),
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
            modelName: 'Permissions',
            tableName: 'Permissions',
            timestamps: true,
        }
    );
    return Permissions;
};
