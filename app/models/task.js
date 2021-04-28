'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Team = this.belongsTo(models.Team, {
        as: 'team',
        foreignKey: 'teamId'
      });

      this.Creator = this.belongsTo(models.User, {
        as: 'creator',
        foreignKey: 'creatorId'
      });

      this.Assignee = this.belongsTo(models.User, {
        as: 'assignee',
        foreignKey: 'assigneeId'
      });
    }
  }
  Task.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};