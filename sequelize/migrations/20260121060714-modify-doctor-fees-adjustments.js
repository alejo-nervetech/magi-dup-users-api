'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.changeColumn('DoctorFees', 'caseId', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('DoctorFees', 'positiveAdjustment', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addColumn('DoctorFees', 'negativeAdjustment', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.removeColumn('DoctorFees', 'adjustment');
        await queryInterface.removeColumn('DoctorFees', 'adjustmentType');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('DoctorFees', 'adjustment', {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0,
        });

        await queryInterface.addColumn('DoctorFees', 'adjustmentType', {
            type: Sequelize.ENUM('positive', 'negative'),
            allowNull: true,
        });

        await queryInterface.removeColumn('DoctorFees', 'positiveAdjustment');
        await queryInterface.removeColumn('DoctorFees', 'negativeAdjustment');

        await queryInterface.changeColumn('DoctorFees', 'caseId', {
            type: Sequelize.STRING,
            allowNull: false,
        });
    },
};
