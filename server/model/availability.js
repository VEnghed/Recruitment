/**
 * Creates a table in the database called availability
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeAvailability(Sequelize, DataTypes, person) {
    return Sequelize.define('availability', {
        availability_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        from_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        to_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        pid: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: person,
                // This is the column name of the referenced model
                key: 'pid',
              }
        }}, {
            tableName: 'availability'
        }
    );
}

export { makeAvailability };