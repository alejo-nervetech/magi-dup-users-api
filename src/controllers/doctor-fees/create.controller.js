'use strict';

const Errors = require('../../errors');
const { DoctorFees } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class CreateDoctorFee extends BaseController {
    static async execute(feeData) {
        try {
            const {
                doctorId,
                caseId,
                cptCode,
                baseFee,
                positiveAdjustment,
                negativeAdjustment,
                justification,
            } = feeData;

            if (!doctorId)
                throw new Errors.BadRequestError('doctorId is required');
            if (!baseFee)
                throw new Errors.BadRequestError('baseFee is required');

            const posAdj = Number(positiveAdjustment || 0);
            const negAdj = Number(negativeAdjustment || 0);
            const hasAdjustments = posAdj > 0 || negAdj > 0;

            if (hasAdjustments && !justification)
                throw new Errors.BadRequestError(
                    'justification is required when adjustments are applied'
                );

            let finalFee = Number(baseFee) + posAdj - negAdj;
            if (finalFee < 0) finalFee = 0;

            const newFee = await DoctorFees.create({
                doctorId,
                caseId: caseId || null,
                cptCode,
                baseFee,
                positiveAdjustment: posAdj,
                negativeAdjustment: negAdj,
                justification,
                finalFee,
            });

            return newFee;
        } catch (error) {
            throw new Errors.BaseError(error);
        }
    }
}

module.exports = CreateDoctorFee;
