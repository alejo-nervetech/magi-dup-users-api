'use strict';

const Errors = require('../../errors');
const { DoctorFees } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class GetDoctorFeeSettings extends BaseController {
    static async execute(doctorId) {
        try {
            if (!doctorId)
                throw new Errors.BadRequestError('doctorId is required');

            const feeSettings = await DoctorFees.findOne({
                where: {
                    doctorId,
                    caseId: null,
                },
            });

            return feeSettings;
        } catch (error) {
            throw new Errors.BaseError(error);
        }
    }
}

module.exports = GetDoctorFeeSettings;
