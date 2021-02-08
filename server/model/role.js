
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
                min: 0
            }
        },
        name: {
            type: DataTypes.STRING,
            allownNull: false,
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
