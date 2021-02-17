/**
 * Creates a table in the database called competence
 * @param {*} Sequelize The tool used for connecting to the database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeCompetence(Sequelize, DataTypes) {
    return Sequelize.define('competence', {
        competence_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allownNull: false
        }}, {
            tableName: 'competence',
            timestamps: false
        }
    );
}

export { makeCompetence };