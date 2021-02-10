
//instance of sequelize
function makeRole(Sequelize, DataTypes) {
    return Sequelize.define('role', {
        role_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
            validate: {
                isInt: true,      
                min: 1,
                max: 2
            }
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isAlpha: true,
            }
        }}, {
            tableName: 'role',
            timestamps: false
        }
    ); 
}

export { makeRole };
