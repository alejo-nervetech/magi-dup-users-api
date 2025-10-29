'use strict';

const {
    Roles,
    Permissions,
    Organizations,
    Users,
} = require('../sequelize/models');
const { v6 } = require('uuid');
const { hashPassword } = require('../src/utils/bcrypt-utils');

const DEFAULT_ROLES = {
    OWNER: 'Owner',
    NURSE: 'Nurse',
    DOCTOR: 'Doctor',
};

const DEFAULT_PERMISSIONS = {
    OWNER: [
        { resource: 'role', accessType: 'W' },
        { resource: 'patient_vitals', accessType: 'W' },
        { resource: 'patient_information', accessType: 'W' },
        { resource: 'doctor_orders', accessType: 'W' },
        { resource: 'diagnosis_prognosis', accessType: 'W' },
        { resource: 'system_user', accessType: 'W' },
        { resource: 'infrastructure', accessType: 'W' },
    ],
    NURSE: [
        { resource: 'patient_vitals', accessType: 'W' },
        { resource: 'patient_information', accessType: 'W' },
        { resource: 'doctor_orders', accessType: 'R' },
    ],
    DOCTOR: [
        { resource: 'patient_vitals', accessType: 'W' },
        { resource: 'patient_information', accessType: 'W' },
        { resource: 'doctor_orders', accessType: 'W' },
        { resource: 'diagnosis_prognosis', accessType: 'W' },
    ],
};

async function createDefaultRolesForOrganization(organizationId) {
    console.log(`Creating default roles for organization: ${organizationId}`);

    const ownerRole = await Roles.create({
        id: `role_${v6().replace(/[^\w\s]/gi, '')}`,
        name: DEFAULT_ROLES.OWNER,
        organizationId: organizationId,
        isDefault: true,
        canBeDeleted: false,
    });

    const nurseRole = await Roles.create({
        id: `role_${v6().replace(/[^\w\s]/gi, '')}`,
        name: DEFAULT_ROLES.NURSE,
        organizationId: organizationId,
        isDefault: true,
        canBeDeleted: false,
    });

    const doctorRole = await Roles.create({
        id: `role_${v6().replace(/[^\w\s]/gi, '')}`,
        name: DEFAULT_ROLES.DOCTOR,
        organizationId: organizationId,
        isDefault: true,
        canBeDeleted: false,
    });

    for (const perm of DEFAULT_PERMISSIONS.OWNER) {
        await Permissions.create({
            id: `perm_${v6().replace(/[^\w\s]/gi, '')}`,
            roleId: ownerRole.id,
            resource: perm.resource,
            accessType: perm.accessType,
        });
    }

    for (const perm of DEFAULT_PERMISSIONS.NURSE) {
        await Permissions.create({
            id: `perm_${v6().replace(/[^\w\s]/gi, '')}`,
            roleId: nurseRole.id,
            resource: perm.resource,
            accessType: perm.accessType,
        });
    }

    for (const perm of DEFAULT_PERMISSIONS.DOCTOR) {
        await Permissions.create({
            id: `perm_${v6().replace(/[^\w\s]/gi, '')}`,
            roleId: doctorRole.id,
            resource: perm.resource,
            accessType: perm.accessType,
        });
    }

    console.log('Default roles and permissions created successfully');

    return {
        owner: ownerRole,
        nurse: nurseRole,
        doctor: doctorRole,
    };
}

async function createTestAdminUser(organizationId, ownerRoleId) {
    const existingAdmin = await Users.findOne({
        where: { email: 'admin@nervetech.com' },
    });

    if (existingAdmin) {
        console.log('Test admin user already exists, skipping...');
        return existingAdmin;
    }

    const hashedPassword = await hashPassword('admin123');

    const adminUser = await Users.create({
        id: `usr_${v6().replace(/[^\w\s]/gi, '')}`,
        email: 'admin@nervetech.com',
        password: hashedPassword,
        name: 'Admin User',
        organizationId: organizationId,
        roleId: ownerRoleId,
        isActive: true,
    });

    console.log('Test admin user created successfully');
    console.log('Email: admin@nervetech.com');
    console.log('Password: admin123');

    return adminUser;
}

async function seedAllOrganizations() {
    try {
        const organizations = await Organizations.findAll();

        if (organizations.length === 0) {
            console.log(
                'No organizations found. Creating test organization...'
            );
            const testOrg = await Organizations.create({
                id: `org_${v6().replace(/[^\w\s]/gi, '')}`,
                name: 'Test Hospital',
                isActive: true,
            });
            organizations.push(testOrg);
            console.log('Test organization created successfully');
        }

        for (const org of organizations) {
            const existingRoles = await Roles.count({
                where: { organizationId: org.id },
            });

            let roles;
            if (existingRoles === 0) {
                roles = await createDefaultRolesForOrganization(org.id);
            } else {
                console.log(
                    `Organization ${org.id} already has roles, skipping...`
                );
                roles = {
                    owner: await Roles.findOne({
                        where: {
                            organizationId: org.id,
                            name: DEFAULT_ROLES.OWNER,
                        },
                    }),
                };
            }

            await createTestAdminUser(org.id, roles.owner.id);
        }

        console.log('Seeding completed');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

module.exports = {
    createDefaultRolesForOrganization,
    seedAllOrganizations,
};

if (require.main === module) {
    seedAllOrganizations();
}
