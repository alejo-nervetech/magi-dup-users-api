'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('Users', 'departmentId');
        await queryInterface.removeColumn('Users', 'roleId');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('Users', 'departmentId', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('Users', 'roleId', {
            type: Sequelize.STRING,
            allowNull: true,
        });
    },
};
