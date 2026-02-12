'use strict';

const { Organizations, Users } = require('../sequelize/models');
const { v6 } = require('uuid');
const { hashPassword } = require('../src/utils/bcrypt-utils');
const {
    createDefaultRolesForOrganization,
    createPlatformAdminRole,
} = require('../src/utils/default-roles');

async function createPlatformAdmin(organizationId) {
    const hashedPassword = await hashPassword('admin123');

    const adminUser = await Users.create({
        id: `usr_${v6().replace(/[^\w\s]/gi, '')}`,
        email: 'admin@nervetech.com',
        password: hashedPassword,
        name: 'Nerve Technologies',
        organizationId: organizationId,
        facilityId: null,
        isActive: true,
    });

    console.log('Platform admin user created successfully');
    console.log('Email: admin@nervetech.com');
    console.log('Password: admin123');

    return adminUser;
}

async function seedPlatform() {
    try {
        console.log('Creating Nerve Technologies platform organization...');
        const platformOrg = await Organizations.create({
            id: `org_${v6().replace(/[^\w\s]/gi, '')}`,
            name: 'Nerve Technologies',
            isPlatform: true,
            isActive: true,
        });
        console.log('Platform organization created successfully');

        await createPlatformAdminRole(platformOrg.id);
        await createPlatformAdmin(platformOrg.id);

        console.log('Seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

module.exports = {
    createDefaultRolesForOrganization,
    seedPlatform,
};

if (require.main === module) {
    seedPlatform();
}
