'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('UserDepartments', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            userId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            departmentId: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            roleId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.addIndex(
            'UserDepartments',
            ['userId', 'departmentId'],
            {
                unique: true,
                name: 'unique_user_department',
            }
        );

        await queryInterface.addIndex('UserDepartments', ['userId'], {
            name: 'idx_user_departments_user_id',
        });

        await queryInterface.addIndex('UserDepartments', ['departmentId'], {
            name: 'idx_user_departments_department_id',
        });

        const { v6 } = require('uuid');
        const [users] = await queryInterface.sequelize.query(
            `SELECT id, "departmentId", "roleId" FROM "Users" WHERE "departmentId" IS NOT NULL AND "roleId" IS NOT NULL AND "deletedAt" IS NULL`
        );

        if (users.length > 0) {
            const insertValues = users.map((user) => {
                const id = `udept_${v6().replace(/[^\w\s]/gi, '')}`;
                return `('${id}', '${user.id}', '${user.departmentId}', '${user.roleId}', NOW(), NOW())`;
            });

            await queryInterface.sequelize.query(
                `INSERT INTO "UserDepartments" (id, "userId", "departmentId", "roleId", "createdAt", "updatedAt") VALUES ${insertValues.join(', ')}`
            );
        }
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('UserDepartments');
    },
};
