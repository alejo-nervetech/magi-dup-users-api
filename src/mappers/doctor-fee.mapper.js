'use strict';

class DoctorFeeMapper {
    constructor(params, total = null) {
        if (Array.isArray(params)) {
            return {
                data: params.map(
                    (docFee) => new DoctorFeeMapper(docFee.dataValues || docFee)
                ),
                total: total || params.length,
            };
        }

        this.id = params.id;
        this.doctorId = params.doctorId;
        this.caseId = params.caseId;
        this.cptCode = params.cptCode;
        this.baseFee = Number(params.baseFee);
        this.positiveAdjustment = Number(params.positiveAdjustment || 0);
        this.negativeAdjustment = Number(params.negativeAdjustment || 0);
        this.justification = params.justification;
        this.finalFee = Number(params.finalFee);
        this.createdAt = params.createdAt;
        this.updatedAt = params.updatedAt;

        return this.object();
    }

    object() {
        return {
            id: this.id,
            doctorId: this.doctorId,
            caseId: this.caseId,
            cptCode: this.cptCode,
            baseFee: this.baseFee,
            positiveAdjustment: this.positiveAdjustment,
            negativeAdjustment: this.negativeAdjustment,
            justification: this.justification,
            finalFee: this.finalFee,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}

module.exports = DoctorFeeMapper;
