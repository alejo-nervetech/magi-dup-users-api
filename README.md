# Base ExpressJS

![image](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![image](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)

Base ExpressJS is a template repository for Nerve Tech PH. As new technologies become available, this repository must be updated in order to ensure that all applications built by the organization are using the latest version.

## Versioning

-   The API version must be constantly updated starting from version 1.0.0
-   Versioning must follow the protocols indicated in [semver 2.0.0](https://semver.org/)
-   When updating the version following version 1.0.0, update `CHANGELOG.md`
-   Ensure that product version is tagged in Github using the following command:

```
$ git tag <version_number>
$ git push origin <version_number>
```

-   Tagging must be done once code has been push to the `main` branch

## Branching

-   The `main` branch will serve as the development branch of the application
-   CI/CD for staging must be pointed towards the `staging` branch
-   Before updating the source artifact for production deployment, rebase the `staging` branch to `production`
    -   After `staging` is rebased to `production`, create another branch based on `production` named `v<version_number>_<YYYY-MM-DD>`
    -   `<version_number>` is based on the latest tag for `production`
        -   Inspect package.json
-   CI/CD for production deployment must be pointed towards the latest production branch indicated by `v<version_number>_<YYYY-MM-DD>`
    -   `<YYYY-MM-DD>` is the date when the production branch was deployed

## Environment Variables

| Environment Variable          | Type   | Description                                                  |
| ----------------------------- | ------ | ------------------------------------------------------------ | ------- | ----------- |
| **Application Configuration** |        |
| PORT                          | string | The port where the application should run. Defaults to 30000 |
| NODE_ENV                      | string | Environment type [development                                | staging | production] |
| **CORS**                      |        |
| CORS_ORIGIN                   | string | CORS origin                                                  |
| **Database**                  |        |
| DB_NAME                       | string | The name of the database                                     |
| DB_HOST                       | string | Host of the database (e.g. http://localhost)                 |
| DB_PORT                       | number | Port number of the database. Defaults to 3306                |
| DB_USER                       | string | Database username                                            |
| DB_PASSWORD                   | string | Database password                                            |
| **Encryption and Security**   |        |
| JWT_TOKEN                     | string | JSON Web Token security key                                  |
