'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Tasks', [{
      teamId: 1,
      createdBy: 1,
      assignee: 2,
      title: 'タスク1',
      body: 'タスク1の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 1,
      createdBy: 1,
      assignee: 2,
      title: 'タスク2',
      body: 'タスク2の本文',
      status: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 1,
      createdBy: 1,
      assignee: null,
      title: 'タスク3',
      body: 'タスク3の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 1,
      createdBy: 1,
      assignee: 1,
      title: 'タスク4',
      body: 'タスク4の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 2,
      createdBy: 1,
      assignee: null,
      title: 'タスク5',
      body: 'タスク5の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 2,
      createdBy: 1,
      assignee: 2,
      title: 'タスク6',
      body: 'タスク6の本文',
      status: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Tasks', null, {});
  }
};
