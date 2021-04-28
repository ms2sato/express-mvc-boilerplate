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
      this.Comments = this.hasMany(models.Comment, {
        foreignKey: 'taskId'
      });

      this.Assignee = this.belongsTo(models.User, {
        foreignKey: 'assignee'
      });

      this.Team = this.belongsTo(models.Team, {
        foreignKey: 'teamId'
      });
    }
  }
  Task.init({
    teamId: DataTypes.INTEGER,
    createdBy: DataTypes.INTEGER,
    assignee: DataTypes.INTEGER,
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  return Task;
};