import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

// Debug environment variables
console.log('🔍 Database Configuration Debug:');
console.log('PGDATABASE:', process.env.PGDATABASE);
console.log('PGUSER:', process.env.PGUSER);
console.log('PGPASSWORD:', process.env.PGPASSWORD ? '[SET]' : '[NOT SET]');
console.log('PGHOST:', process.env.PGHOST);
console.log('NODE_ENV:', process.env.NODE_ENV);

// Use a connection string instead of individual parameters
const connectionString = `postgres://${process.env.PGUSER}:${encodeURIComponent(process.env.PGPASSWORD || '')}@${process.env.PGHOST}/${process.env.PGDATABASE}`;
console.log('Connection string (without password):', connectionString.replace(/:.*@/, ':***@'));

const sequelize = new Sequelize(connectionString, {
  dialect: 'postgres',
  dialectOptions: {
    // Disable SSL for local development
    ssl: false
  },
  logging: false
});

export default sequelize;