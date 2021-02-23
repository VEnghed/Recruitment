/**
 * Creates a table in the database called availability
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeApplicationstatus(Sequelize, DataTypes, person) {
    return Sequelize.define('applicationStatus', {
        application_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            isIn: [['accepted','rejected','unhandled']]
        },
        person: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: person,
                // This is the column name of the referenced model
                key: 'pid',
              }
        }}, {
            tableName: 'availability',
            timestamps: true, 
            updatedAt: false
        }
    );
}

export { makeApplicationstatus };