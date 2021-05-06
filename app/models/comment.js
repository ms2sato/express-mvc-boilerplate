'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.Task = this.belongsTo(models.Task, {
        foreignKey: 'taskId',
        as: 'task'
      });

      this.Creator = this.belongsTo(models.User, {
        foreignKey: 'creatorId',
        as: 'creator'
      });
    }

    isFinished() {
      return this.kind === this.constructor.kinds.finished;
    }
  }
  Comment.init({
    message: {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: {
          msg: 'メッセージは空ではいけません'
        },
        len: {
          args: [1, 2048],
          msg: 'メッセージは2048文字以内です'
        }
      }
    },
    kind: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Comment',
  });

  Comment.kinds = { normal: 0, finished: 1 };
  return Comment;
};