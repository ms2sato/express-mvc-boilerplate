'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Comments', [{
      taskId: 1,
      createdBy: 1,
      message: 'コメント1',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 1,
      createdBy: 2,
      message: 'コメント2',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 2,
      createdBy: 1,
      message: 'コメント1',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 2,
      createdBy: 2,
      message: 'コメント2 完了しました！',
      kind: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 3,
      createdBy: 1,
      message: 'コメント1',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 3,
      createdBy: 2,
      message: 'コメント2',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
