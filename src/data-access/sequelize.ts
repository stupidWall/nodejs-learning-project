import { Sequelize } from 'sequelize';
import CONFIG from '../config';

const { postgres } = CONFIG;

const sequelize = new Sequelize(
    `postgres://${postgres.user}:${postgres.password}@${postgres.host}:${postgres.port}/${postgres.database}`
);

const connect = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

connect();

export default sequelize;
