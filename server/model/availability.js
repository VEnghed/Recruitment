/**
 * Creates a table in the database called availability
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeAvailability(Sequelize, DataTypes) {
    return Sequelize.define('availability', {
        availability_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        from_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        },
        to_date: {
            type: DataTypes.DATEONLY,
            allowNull: false
        }}, {
            tableName: 'availability',
            timestamps: false
        }
    );
}

export { makeAvailability };