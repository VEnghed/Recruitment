/**
 * Creates a table in the database called role
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeRole(Sequelize, DataTypes) {
    return Sequelize.define('role', {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        }}, {
            tableName: 'role',
            timestamps: false
        }
    ); 
}

export { makeRole };