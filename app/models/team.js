'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Team extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Members = this.hasMany(models.Member, {
        foreignKey: 'teamId'
      });

      this.Tasks = this.hasMany(models.Task, {
        foreignKey: 'teamId'
      });

      this.Users = this.belongsToMany(models.User, {
        through: 'Member',
        foreignKey: 'userId'
      });
    }
  }
  Team.init({
    name: DataTypes.STRING,
    owner: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};