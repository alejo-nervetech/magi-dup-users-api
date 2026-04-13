'use strict';

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dbClient = require('./../database/client');
const express = require('express');
const ForbiddenError = require('./errors/forbidden.error');
const helmet = require('helmet');
const path = require('path');
const { Glob } = require('glob');

class Server {
    constructor(config) {
        this.config = config;
        this.app = express();
    }

    setupMiddleware() {
        this.app.use(cookieParser());
        this.app.use(
            bodyParser.json({
                limit: '50mb',
            })
        );
        this.app.use(
            bodyParser.urlencoded({
                extended: true,
                limit: '50mb',
            })
        );
        this.app.use(
            cors({
                origin: (origin, cb) => {
                    if (!origin || this.config.cors.includes(origin)) {
                        cb(null, true);
                    } else {
                        cb(new ForbiddenError().message);
                    }
                },
            })
        );
        this.app.use(helmet());
    }

    setupEndpoints() {
        const routes = new Glob('src/routes/[!_]*.route.js', {});

        for (const route of routes) {
            const basePath = path.basename(route);
            const Route = require(`./routes/${basePath}`);

            new Route(this.app).load();
        }
    }

    async start() {
        const port = this.config.port;
    this.app.get('/healthcheck', (_req, res) => {
            res.send('ok');
        this.setupMiddleware();
        this.setupEndpoints();

        dbClient.authenticate();

    
        });

        this.app.use((error, _req, res, _next) => {
            try {
                res.status(error.statusCode);
                res.send(error);
            } catch (_error) {
                res.status(500);
                res.send({
                    message: error.message,
                    statusCode: 500,
                    details: {
                        code: 'internal_server_error',
                    },
                });
            }
        });

        this.instance = await this.app.listen(port);
        console.info(`Server started at port ${port}`);
    }

    exit() {
        if (this.instance) {
            this.instance.close();
            console.info('Instance terminated');
        }
    }
}

module.exports = Server;
