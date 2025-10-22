const Organization = require('./../models/organization.model');
const User = require('./../models/user.model');

const bcrypt = require('bcrypt');
const config = require('./../../config');
const mongoose = require('mongoose');

mongoose.connect(config.database.connectionString).then(async () => {
    let organizationId;

    const matchingOrganizations = await Organization.find({
        email: 'admin@nervetech.com',
    });

    if (matchingOrganizations.length === 0) {
        const organization = new Organization({
            name: 'Nerve Tech',
            email: 'admin@nervetech.com',
        });

        organizationId = (await organization.save())._id;
        console.log(`Created organization: ${organizationId}`);
    } else {
        console.log(
            `Seed organization already exists with ID ${matchingOrganizations[0]._id}`
        );
    }

    const matchingUsers = await User.find({
        email: 'admin@nervetech.com',
    });

    if (matchingUsers.length === 0) {
        const hashedPassword = await bcrypt.hash(
            '12345678',
            config.encryption.saltRounds
        );

        const user = new User({
            name: 'Nerve Tech Administrator',
            email: 'admin@nervetech.com',
            password: hashedPassword,
            organizationId: organizationId,
            birthdate: new Date('1990-01-01').getTime(),
        });

        const userId = (await user.save())._id;
        console.log(`Added user ${userId} to organization`);
    } else {
        console.log(`Seed user already exists with ID ${matchingUsers[0]._id}`);
    }
});
