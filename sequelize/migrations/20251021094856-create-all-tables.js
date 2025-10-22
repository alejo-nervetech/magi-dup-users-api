'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Organizations', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
            deletedAt: {
                type: Sequelize.DATE,
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

        await queryInterface.createTable('Roles', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            organizationId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            isDefault: {
                type: Sequelize.BOOLEAN,
                defaultValue: false,
                allowNull: false,
            },
            canBeDeleted: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
                allowNull: false,
            },
            deletedAt: {
                type: Sequelize.DATE,
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

        await queryInterface.createTable('Users', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            organizationId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Organizations',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },
            roleId: {
                type: Sequelize.STRING,
                allowNull: false,
                references: {
                    model: 'Roles',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL',
            },
            isActive: {
                type: Sequelize.BOOLEAN,
                defaultValue: true,
            },
            deletedAt: {
                type: Sequelize.DATE,
            },
            createdAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
            updatedAt: {
                type: Sequelize.DATE,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
            },
        });

        await queryInterface.createTable('Permissions', {
            id: {
                type: Sequelize.STRING,
                primaryKey: true,
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
            resource: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            accessType: {
                type: Sequelize.ENUM('R', 'W'),
                allowNull: false,
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

        await queryInterface.addIndex('Users', ['email']);
        await queryInterface.addIndex('Users', ['organizationId']);
        await queryInterface.addIndex('Roles', ['organizationId']);
        await queryInterface.addIndex('Permissions', ['roleId']);
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Permissions');
        await queryInterface.dropTable('Users');
        await queryInterface.dropTable('Roles');
        await queryInterface.dropTable('Organizations');
    },
};
