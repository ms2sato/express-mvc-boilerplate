'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      provider: 'demo',
      uid: 'user1',
      username: 'user1',
      displayName: 'User1',
      email: 'user1@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      provider: 'demo',
      uid: 'user2',
      username: 'user2',
      displayName: 'User2',
      email: 'user2@example.com',
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
