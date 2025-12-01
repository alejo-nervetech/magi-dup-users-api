'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('DoctorFees', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            doctorId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            caseId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            cptCode: {
                type: Sequelize.STRING,
            },
            baseFee: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            adjustment: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
                defaultValue: 0,
            },
            adjustmentType: {
                type: Sequelize.ENUM('positive', 'negative'),
                allowNull: true,
            },
            justification: {
                type: Sequelize.TEXT,
            },
            finalFee: {
                type: Sequelize.DECIMAL(10, 2),
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('DoctorFees');
    },
};
