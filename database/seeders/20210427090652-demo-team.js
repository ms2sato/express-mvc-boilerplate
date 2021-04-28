'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Teams', [{
      name: 'Team1',
      owner: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      name: 'Team2',
      owner: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Teams', null, {});
  }
};
