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

      this.Comments = this.hasMany(models.Comment, {
        foreignKey: 'taskId'
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

    async finish(message, user) {
      if(this.status !== Task.statuses.notStarted) {
        throw new Error('進行中タスクでなければ完了できません');
      }

      await sequelize.transaction(async (t)=>{
        this.status = Task.statuses.finished;
        await this.save({ field: ['status'], transaction: t });
        
        await Task.Comment.create({
          taskId: this.id,
          creatorId: user.id,
          kind: Task.Comment.kinds.finished,
          message
        }, { transaction: t });
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
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'タイトルは空ではいけません'
        },
        len: { 
          msg: 'タイトルは255文字未満です',
          args: [0, 255]
        }
      }
    },    
    body: { 
      type: DataTypes.TEXT,
      len: { 
        msg: '本文は4096文字未満です',
        args: [0, 4096]
      }
    },
    status: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });
  // TODO: アサインされたことをstatusに反映していないのでinProgressは無いがこれで良いか？
  Task.statuses = { notStarted: 0, finished: 1, archived: 2 };
  return Task;
};