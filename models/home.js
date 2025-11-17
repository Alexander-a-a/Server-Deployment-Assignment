module.exports = (sequelize, Sequelize) => {
    const Home = sequelize.define('Home', {
        country: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        },
        city: {
            type: Sequelize.DataTypes.STRING,
            allowNull: false
        }
    },{
        timestamps: false
    });
    Home.associate = function(models) {
        Home.belongsTo(models.Participant);
    };
    return Home
}