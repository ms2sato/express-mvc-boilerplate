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

    static async createWithOwner(user, params) {
      return await sequelize.transaction(async (t) => {
        const team = this.build(params);
        team.set({
          ownerId: user.id
        });
        await team.save({ fields: ['name', 'ownerId'], transaction: t });

        await this.Member.create({
          teamId: team.id,
          userId: user.id,
          role: this.Member.roles.manager
        }, { transaction: t });

        return team;
      });
    }

    async isManager(user) {
      // @see https://sequelize.org/master/manual/eager-loading.html#complex-where-clauses-at-the-top-level
      return await this.countMembers({
        where: {
          '$Member.role$': this.constructor.Member.roles.manager,
          '$Member.userId$': user.id
        }
      }) != 0;
    }
  }
  Team.init({
    name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'チーム名は必須です'
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Team',
  });
  return Team;
};