'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'userType', {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: 'employee',
        });

        await queryInterface.addColumn('Users', 'specialization', {
            type: Sequelize.STRING,
            allowNull: true,
        });

        await queryInterface.addColumn('Users', 'subspecialization', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'subspecialization');
        await queryInterface.removeColumn('Users', 'specialization');
        await queryInterface.removeColumn('Users', 'userType');
    },
};
