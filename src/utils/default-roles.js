'use strict';

const { Roles, Permissions } = require('../../sequelize/models');
const { v6 } = require('uuid');

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
        { resource: 'requisition', accessType: 'W' },
        { resource: 'requisition_approval', accessType: 'W' },
    ],
    NURSE: [
        { resource: 'patient_vitals', accessType: 'W' },
        { resource: 'patient_information', accessType: 'W' },
        { resource: 'doctor_orders', accessType: 'R' },
        { resource: 'requisition', accessType: 'W' },
    ],
    DOCTOR: [
        { resource: 'patient_vitals', accessType: 'W' },
        { resource: 'patient_information', accessType: 'W' },
        { resource: 'doctor_orders', accessType: 'W' },
        { resource: 'diagnosis_prognosis', accessType: 'W' },
        { resource: 'requisition', accessType: 'W' },
        { resource: 'requisition_approval', accessType: 'W' },
    ],
};

const PLATFORM_ADMIN_PERMISSIONS = [
    { resource: 'infrastructure', accessType: 'W' },
    { resource: 'system_user', accessType: 'W' },
];

async function createRoleWithPermissions(
    organizationId,
    name,
    permissions,
    { isDefault = true, canBeDeleted = false } = {}
) {
    const role = await Roles.create({
        id: `role_${v6().replace(/[^\w\s]/gi, '')}`,
        name,
        organizationId,
        isDefault,
        canBeDeleted,
    });

    for (const perm of permissions) {
        await Permissions.create({
            id: `perm_${v6().replace(/[^\w\s]/gi, '')}`,
            roleId: role.id,
            resource: perm.resource,
            accessType: perm.accessType,
        });
    }

    return role;
}

async function createDefaultRolesForOrganization(organizationId) {
    console.log(`Creating default roles for organization: ${organizationId}`);

    const owner = await createRoleWithPermissions(
        organizationId,
        DEFAULT_ROLES.OWNER,
        DEFAULT_PERMISSIONS.OWNER
    );

    const nurse = await createRoleWithPermissions(
        organizationId,
        DEFAULT_ROLES.NURSE,
        DEFAULT_PERMISSIONS.NURSE
    );

    const doctor = await createRoleWithPermissions(
        organizationId,
        DEFAULT_ROLES.DOCTOR,
        DEFAULT_PERMISSIONS.DOCTOR
    );

    console.log('Default roles and permissions created successfully');

    return { owner, nurse, doctor };
}

async function createPlatformAdminRole(organizationId) {
    console.log(
        `Creating Platform Admin role for organization: ${organizationId}`
    );

    const role = await createRoleWithPermissions(
        organizationId,
        'Platform Admin',
        PLATFORM_ADMIN_PERMISSIONS
    );

    console.log('Platform Admin role created successfully');

    return role;
}

module.exports = {
    DEFAULT_ROLES,
    DEFAULT_PERMISSIONS,
    PLATFORM_ADMIN_PERMISSIONS,
    createDefaultRolesForOrganization,
    createPlatformAdminRole,
    createRoleWithPermissions,
};
