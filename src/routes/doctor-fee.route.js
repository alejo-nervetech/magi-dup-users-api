'use strict';

const BaseRoute = require('./base-route');
const authenticate = require('../middlewares/authenticate');
const CreateDoctorFee = require('../controllers/doctor-fees/create.controller');
const DoctorFeeMapper = require('../mappers/doctor-fee.mapper');

class DoctorFeeRoute extends BaseRoute {
    load() {
        this.app.post('/v1/doctor-fee', authenticate, this.createDoctorFee);
    }

    async createDoctorFee(req, res, next) {
        try {
            const response = await CreateDoctorFee.execute(req.body);
            res.send(new DoctorFeeMapper(response.dataValues));
        } catch (error) {
            next(error);
        }
    }
}

module.exports = DoctorFeeRoute;
