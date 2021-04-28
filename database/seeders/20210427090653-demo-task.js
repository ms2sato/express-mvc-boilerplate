'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [{
      teamId: 1,
      creatorId: 1,
      assigneeId: 2,
      title: 'タスク1',
      body: 'タスク1の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 1,
      creatorId: 1,
      assigneeId: 2,
      title: 'タスク2',
      body: 'タスク2の本文',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 1,
      creatorId: 1,
      assigneeId: null,
      title: 'タスク3',
      body: 'タスク3の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 1,
      creatorId: 1,
      assigneeId: 1,
      title: 'タスク4',
      body: 'タスク4の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 2,
      creatorId: 1,
      assigneeId: null,
      title: 'タスク5',
      body: 'タスク5の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 2,
      creatorId: 1,
      assigneeId: 2,
      title: 'タスク6',
      body: 'タスク6の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};
