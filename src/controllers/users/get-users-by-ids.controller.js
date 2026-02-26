'use strict';

const BaseController = require('../base-controller');
const Errors = require('../../errors');
const { Users } = require('../../../sequelize/models');
const { Op } = require('sequelize');

class GetUsersByIdsController extends BaseController {
    static async execute(data) {
        try {
            if (
                !data.userIds ||
                !Array.isArray(data.userIds) ||
                data.userIds.length === 0
            ) {
                throw new Errors.BadRequestError(
                    'userIds must be a non-empty array'
                );
            }

            const users = await Users.findAll({
                where: {
                    id: { [Op.in]: data.userIds },
                },
                attributes: [
                    'id',
                    'name',
                    'userType',
                    'specialization',
                    'subspecialization',
                ],
            });

            return users;
        } catch (error) {
            throw error;
        }
    }
}

module.exports = GetUsersByIdsController;
