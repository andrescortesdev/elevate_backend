import dotenv from 'dotenv';
import Sequelize from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(process.env.MYSQL_ADDON_DB, process.env.MYSQL_ADDON_USER, process.env.MYSQL_ADDON_PASSWORD, {
    host: process.env.MYSQL_ADDON_HOST,
    port: process.env.MYSQL_ADDON_PORT,
    dialect: 'mysql',
    logging: false, // Disable SQL query logging
    dialectOptions: {
        ssl: {
            rejectUnauthorized: false,
        },
    },
});

sequelize.authenticate()
    .then(() => {
        console.log('✅ Database connected successfully (Sequelize)');
    })
    .catch(error => {
        console.error('❌ Database connection error:', error.message);
    });

export default sequelize;
