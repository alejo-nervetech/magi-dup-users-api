'use strict';

const Errors = require('../../errors');
const { DoctorFees } = require('../../../sequelize/models');
const BaseController = require('../base-controller');

class UpdateDoctorFeeSettings extends BaseController {
    static async execute(doctorId, feeData) {
        try {
            if (!doctorId)
                throw new Errors.BadRequestError('doctorId is required');

            const {
                cptCode,
                baseFee,
                positiveAdjustment,
                negativeAdjustment,
                justification,
                caseId,
            } = feeData;

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

            const existingSettings = await DoctorFees.findOne({
                where: {
                    doctorId,
                    caseId: null,
                },
            });

            if (existingSettings) {
                await existingSettings.update({
                    cptCode,
                    baseFee,
                    positiveAdjustment: posAdj,
                    negativeAdjustment: negAdj,
                    justification,
                    finalFee,
                    caseId,
                });
                return existingSettings;
            } else {
                const newSettings = await DoctorFees.create({
                    doctorId,
                    caseId: null,
                    cptCode,
                    baseFee,
                    positiveAdjustment: posAdj,
                    negativeAdjustment: negAdj,
                    justification,
                    finalFee,
                });
                return newSettings;
            }
        } catch (error) {
            throw new Errors.BaseError(error);
        }
    }
}

module.exports = UpdateDoctorFeeSettings;
