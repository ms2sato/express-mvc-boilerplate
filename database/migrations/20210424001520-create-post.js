'use strict';

const fkName = 'user_id_posts_fk';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,     
        type: Sequelize.INTEGER   
      },
      title: {
        type: Sequelize.STRING
      },
      body: {
        type: Sequelize.TEXT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addConstraint('Posts', { 
      fields: ['userId'], 
      type: 'foreign key',
      name: fkName,
      references: {
        table: 'Users',
        field: 'id'
      },
      onDelete: 'cascade'
    });
  },
  down: async (queryInterface, _Sequelize) => {
    await queryInterface.removeConstraint('Posts', fkName);
    await queryInterface.dropTable('Posts');
  }
};