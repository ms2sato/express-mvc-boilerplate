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
      this.Comment = models.Comment;

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

    static activeStatuses() {
      return [this.statuses.notStarted, this.statuses.finished];
    }

    async archive() {
      if(this.status !== Task.statuses.finished) {
        throw new Error('完了状態のタスクでなければアーカイブできません');
      }

      this.status = Task.statuses.archived;
      await this.save({ field: ['status'] });
    }

    async finish(message) {
      if(this.status !== Task.statuses.notStarted) {
        throw new Error('進行中タスクでなければ完了できません');
      }

      await sequelize.transaction(async (t)=>{
        this.status = Task.statuses.finished;
        await this.save({ field: ['status'], transaction: t });
        
        await Task.Comment.create({
          taskId: this.id,
          creatorId: this.assigneeId,
          kind: Task.Comment.statuses.finished,
          message
        });
      });
    }

    isNotStarted() {
      return this.status === Task.statuses.notStarted;
    }
    isFinished() {
      return this.status === Task.statuses.finished;
    }
    isArchived() {
      return this.status === Task.statuses.archived;
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
  // TODO: アサインされたことをstatusに反映していないのでinProgressは無いがこれで良いか？
  Task.statuses = { notStarted: 0, finished: 1, archived: 2 };
  return Task;
};