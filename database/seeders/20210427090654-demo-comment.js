'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Comments', [{
      taskId: 1,
      creatorId: 1,
      message: 'コメント1',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 1,
      creatorId: 2,
      message: 'コメント2',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 2,
      creatorId: 1,
      message: 'コメント1',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 2,
      creatorId: 2,
      message: 'コメント2 完了しました！',
      kind: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 3,
      creatorId: 1,
      message: 'コメント1',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      taskId: 3,
      creatorId: 2,
      message: 'コメント2',
      kind: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Comments', null, {});
  }
};
