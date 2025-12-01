'use strict';

const Errors = require('../../errors');
const { DoctorFees } = require('../../../sequelize/models');
const BaseController = require('../base-controller');
const { v6 } = require('uuid');

class CreateDoctorFee extends BaseController {
    static async execute(feeData) {
        try {
            const {
                doctorId,
                caseId,
                cptCode,
                baseFee,
                adjustment,
                adjustmentType,
                justification,
            } = feeData;

            if (!doctorId)
                throw new Errors.BadRequestError('doctorId is required');
            if (!caseId) throw new Errors.BadRequestError('caseId is required');
            if (!baseFee)
                throw new Errors.BadRequestError('baseFee is required');

            const adj = Number(adjustment || 0);

            if (adj > 0 && !adjustmentType)
                throw new Errors.ValidationError(
                    'adjustmentType is required when adjustment is provided'
                );

            if (adjustmentType && !justification)
                throw new Errors.BadRequestError(
                    'justification is required for adjustments'
                );

            let finalFee = Number(baseFee);

            if (adjustmentType === 'positive') finalFee += adj;
            if (adjustmentType === 'negative') finalFee -= adj;

            if (finalFee < 0) finalFee = 0;

            const newFee = await DoctorFees.create({
                doctorId,
                caseId,
                cptCode,
                baseFee,
                adjustment: adj,
                adjustmentType,
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
