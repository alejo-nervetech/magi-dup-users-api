'use strict';

const DEFAULT_ROLES = {
    OWNER: 'Owner',
    NURSE: 'Nurse',
    DOCTOR: 'Doctor',
};

const RESOURCES = {
    ROLE: 'role',
    PATIENT_VITALS: 'patient_vitals',
    PATIENT_INFORMATION: 'patient_information',
    DOCTOR_ORDERS: 'doctor_orders',
    DIAGNOSIS_PROGNOSIS: 'diagnosis_prognosis',
};

const ACCESS_TYPES = {
    READ: 'R',
    WRITE: 'W',
};

module.exports = {
    DEFAULT_ROLES,
    RESOURCES,
    ACCESS_TYPES,
};
