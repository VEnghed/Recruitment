/**
 * Creates a table in the database called competence_profile
 * @param {*} Sequelize The tool used for connecting to database
 * @param {*} DataTypes Used for defining the datatypes in the table
 */
function makeCompetenceProfile(Sequelize, DataTypes, person, competence) {
    return Sequelize.define('competence_profile', {
        competence_profile_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        years_of_experience: {
            type: DataTypes.INTEGER,
            allownNull: false
        },
        pid: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: person,
                // This is the column name of the referenced model
                key: 'pid',
              }
        },
        competence_id: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: competence,
                // This is the column name of the referenced model
                key: 'competence_id',
              }
        }}, {
            tableName: 'competence_profile',
            timestamps: false
        }
    );
}

export { makeCompetenceProfile };