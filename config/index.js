require('dotenv/config')
module.exports = {
    databases: require('./databases'),
    env: {
        HOST: process.env.HOST,
        PORT: process.env.PORT,
        NODE_ENV: process.env.NODE_ENV,
        DB_HOST: process.env.DB_HOST,
        DB_PORT: process.env.DB_PORT,
        DB_NAME: process.env.DB_NAME,
        DB_USER: process.env.DB_USER,
        DB_PASS: process.env.DB_PASS,
        JWT_SECRET: process.env.JWT_SECRET,
    },
    sequelize: require('./sequelize')
}