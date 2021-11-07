import Sequelize from 'sequelize'

export default new Sequelize('database', 'user', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: false,
    // SQLite only
    storage: './src/database/database.sqlite',
})