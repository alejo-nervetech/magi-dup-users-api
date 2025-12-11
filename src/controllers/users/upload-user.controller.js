'use strict';

const BaseController = require('../base-controller');
const Errors = require('./../../errors');
const { Users, Roles } = require('../../../sequelize/models');
const { hashPassword } = require('../../utils/bcrypt-utils');
const { v6 } = require('uuid');
const path = require('path');
const fs = require('fs');
const csv = require('csv-parser');
const axios = require('axios');
const config = require('../../../config');
const { Op, fn, col, where } = require('sequelize');

class UploadUserController extends BaseController {
    static async execute(req) {
        let filePath;

        try {
            if (!req.file) {
                throw new Errors.BadRequestError('No file uploaded');
            }

            if (!req.user || !req.user.organizationId) {
                throw new Errors.BadRequestError(
                    'Missing organizationId in request user'
                );
            }

            filePath = path.resolve(req.file.path);
            const rows = [];
            const errors = [];

            await new Promise((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv({ mapHeaders: ({ header }) => header.trim() }))
                    .on('data', (row) => {
                        const isEmptyRow = Object.values(row).every(
                            (field) => field === '' || field === undefined
                        );
                        if (!isEmptyRow) rows.push(row);
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            for (let i = 0; i < rows.length; i++) {
                const rowNumber = i + 1;
                const row = rows[i];

                try {
                    let departmentId = null;
                    if (row.department) {
                        departmentId = await this.getDepartmentIdByName(
                            row.department,
                            req.user.organizationId
                        );
                        if (!departmentId) {
                            throw new Error(
                                `Department '${row.department}' not found`
                            );
                        }
                    }

                    let roleId = null;
                    if (row.role) {
                        roleId = await this.getRoleIdByName(
                            row.role.trim(),
                            req.user.organizationId
                        );
                        if (!roleId) {
                            throw new Error(`Role '${row.role}' not found`);
                        }
                    }

                    const fullName = [
                        row.firstName,
                        row.middleName,
                        row.lastName,
                        row.suffix,
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .trim();

                    const userData = {
                        name: fullName,
                        email: row.email,
                        password: await hashPassword(row.password),
                        organizationId: req.user.organizationId,
                        departmentId,
                        roleId,
                        facilityId: req.user.facilityId,
                        specialization: row.specialization || null,
                        subspecialization: row.subspecialization || null,
                    };

                    await Users.create(userData);
                } catch (err) {
                    let errorMessage = err.message;

                    if (err.name === 'SequelizeUniqueConstraintError') {
                        errorMessage = `${err.errors[0].path} already exists`;
                    }

                    if (err.name === 'SequelizeValidationError') {
                        errorMessage = err.errors
                            .map((e) => e.message)
                            .join(', ');
                    }

                    errors.push(`Row ${rowNumber}: ${errorMessage}`);
                }
            }

            return {
                success: true,
                message: 'File processed. Some rows may contain errors.',
                errors,
            };
        } catch (error) {
            throw new Errors.BaseError(error.message || error);
        } finally {
            if (filePath) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error('Failed to delete file:', err);
                });
            }
        }
    }

    static async getDepartmentIdByName(departmentName, organizationId) {
        if (!departmentName) throw new Error('Department name is required');
        if (!organizationId) throw new Error('Organization ID is required');

        const url = `${config.services.facilityApi}/v1/departments/by-dept-name`;

        try {
            const response = await axios.get(url, {
                headers: {
                    'X-Service-Token': config.serviceSecret,
                    'Content-Type': 'application/json',
                },
                params: {
                    name: departmentName.trim(),
                    organizationId: organizationId.trim(),
                },
            });

            return Array.isArray(response.data) && response.data.length > 0
                ? response.data[0]
                : null;
        } catch (error) {
            throw new Error(error.message || 'Error fetching department');
        }
    }

    static async getRoleIdByName(roleName, organizationId) {
        if (!roleName) throw new Error('Role name is required');
        if (!organizationId) throw new Error('Organization ID is required');

        const role = await Roles.findOne({
            where: {
                organizationId,
                [Op.and]: [
                    where(fn('LOWER', col('name')), roleName.toLowerCase()),
                ],
            },
        });

        return role ? role.id : null;
    }
}

module.exports = UploadUserController;
