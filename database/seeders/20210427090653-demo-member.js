'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Members', [{
      teamId: 1,
      userId: 1,
      role: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 1,
      userId: 2,
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 2,
      userId: 1,
      role: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      teamId: 2,
      userId: 2,
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Members', null, {});
  }
};
