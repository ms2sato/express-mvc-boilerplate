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
      this.Member = models.Member;

      this.Members = this.hasMany(models.Member, {
        foreignKey: 'teamId'
      });

      this.Tasks = this.hasMany(models.Task, {
        foreignKey: 'teamId'
      });

      this.Users = this.belongsToMany(models.User, {
        through: 'Member',
        foreignKey: 'teamId'
      });

      this.Owner = this.belongsTo(models.User, {
        foreignKey: 'ownerId',
        as: 'owner'
      });
    }

    async isManager(user) {
      return await this.countMembers({
        where: {
          '$Member.role$': this.constructor.Member.roles.manager,
          '$Member.userId$': user.id
        }
      }) != 0;
    }
  }
  Team.init({
    name: DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};