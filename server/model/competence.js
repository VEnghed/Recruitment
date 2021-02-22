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
<<<<<<< HEAD
<<<<<<< HEAD
            timestamps: false
=======
            timestamps: 'false'
>>>>>>> 9eb4891 (start implementing transaction handling)
=======
            timestamps: 'false'
>>>>>>> 1ea745c (start implementing transaction handling)
        }
    );
}

export { makeCompetence };
