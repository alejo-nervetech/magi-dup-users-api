'use strict';

const Errors = require('../../errors');
const { DoctorFees } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class GetCaseDoctorFeeController extends BaseController {
    static async execute(caseId) {
        try {
            if (!caseId)
                throw new Errors.BadRequestError('Case ID is Required');

            const caseFee = await DoctorFees.findOne({
                where: {
                    caseId: caseId,
                },
            });

            return caseFee;
        } catch (error) {
            throw new Errors.BaseError(error);
        }
    }
}

module.exports = GetCaseDoctorFeeController;
