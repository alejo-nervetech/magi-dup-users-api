'use strict';

const BaseRoute = require('./base-route');
const authenticate = require('../middlewares/authenticate');
const CreateDoctorFee = require('../controllers/doctor-fees/create.controller');
const GetDoctorFeeSettings = require('../controllers/doctor-fees/get.controller');
const UpdateDoctorFeeSettings = require('../controllers/doctor-fees/update.controller');
const DoctorFeeMapper = require('../mappers/doctor-fee.mapper');

class DoctorFeeRoute extends BaseRoute {
    load() {
        this.app.post('/v1/doctor-fee', authenticate, this.createDoctorFee);
        this.app.get(
            '/v1/doctor-fee/settings/:doctorId',
            authenticate,
            this.getDoctorFeeSettings
        );
        this.app.put(
            '/v1/doctor-fee/settings/:doctorId',
            authenticate,
            this.updateDoctorFeeSettings
        );
    }

    async createDoctorFee(req, res, next) {
        try {
            const response = await CreateDoctorFee.execute(req.body);
            res.send(new DoctorFeeMapper(response.dataValues));
        } catch (error) {
            next(error);
        }
    }

    async getDoctorFeeSettings(req, res, next) {
        try {
            const { doctorId } = req.params;
            const response = await GetDoctorFeeSettings.execute(doctorId);
            if (!response) {
                return res.send({ data: null });
            }
            res.send({ data: new DoctorFeeMapper(response.dataValues) });
        } catch (error) {
            next(error);
        }
    }

    async updateDoctorFeeSettings(req, res, next) {
        try {
            const { doctorId } = req.params;
            const response = await UpdateDoctorFeeSettings.execute(
                doctorId,
                req.body
            );
            res.send({ data: new DoctorFeeMapper(response.dataValues) });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DoctorFeeRoute;
