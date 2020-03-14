module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('t_credential', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      item_id: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      item_type: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      data: {
        allowNull: false,
        type: Sequelize.TEXT,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('t_credential');
  },
};
