/**
 * Creates a table in the database called availability
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeApplicationstatus(Sequelize, DataTypes) {
    return Sequelize.define('applicationStatus', {
        application_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        application_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: Sequelize.NOW,
            validate: {
                notEmpty: true
            }
        }
        }, {
            tableName: 'applicationstatus',
            timestamps: false
        }
    );
} 
 
export { makeApplicationstatus };