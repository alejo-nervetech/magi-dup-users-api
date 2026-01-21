'use strict';

const { Model } = require('sequelize');
const { v6 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    class DoctorFees extends Model {
        static associate(models) {
            DoctorFees.belongsTo(models.Users, {
                foreignKey: 'doctorId',
                as: 'doctor',
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            });
        }
    }

    DoctorFees.init(
        {
            id: {
                type: DataTypes.STRING,
                primaryKey: true,
                defaultValue: () => `df_${v6().replace(/[^\w\s]/gi, '')}`,
            },
            doctorId: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            caseId: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            cptCode: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            baseFee: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
            },
            positiveAdjustment: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
                allowNull: false,
            },
            negativeAdjustment: {
                type: DataTypes.DECIMAL(10, 2),
                defaultValue: 0,
                allowNull: false,
            },
            justification: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            finalFee: {
                type: DataTypes.DECIMAL(10, 2),
                allowNull: false,
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
            modelName: 'DoctorFees',
            tableName: 'DoctorFees',
            timestamps: true,
        }
    );
    return DoctorFees;
};
