'use strict';

const { Model } = require('sequelize');
const { v6 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class Organizations extends Model {
        static associate(models) {
            Organizations.hasMany(models.Users, {
                foreignKey: 'organizationId',
                as: 'users',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
            Organizations.hasMany(models.Roles, {
                foreignKey: 'organizationId',
                as: 'roles',
                onDelete: 'CASCADE',
                onUpdate: 'CASCADE',
            });
        }
    }

    Organizations.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: () => `org_${v6().replace(/[^\w\s]/gi, '')}`,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            isPlatform: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            isActive: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
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
            modelName: 'Organizations',
            tableName: 'Organizations',
            timestamps: true,
            paranoid: true,
        }
    );
    return Organizations;
};
