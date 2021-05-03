'use strict';

module.exports = {
  up: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkInsert('Teams', [{
      name: 'Team1',
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Team2',
      ownerId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, _Sequelize) => {
    return queryInterface.bulkDelete('Teams', null, {});
  }
};
