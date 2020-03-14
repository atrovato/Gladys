module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.bulkInsert(
      't_credential',
      [
        {
          id: '7126db57-55c0-41e3-8088-a999b51eb0df',
          item_id: 'a1ce3d5a-dd7c-4452-9a23-d44ba3d9b072',
          item_type: 'device',
          data: Buffer.from(JSON.stringify({ username: 'device_username', password: 'device_password' })).toString(
            'base64',
          ),
          created_at: '2019-02-12 07:49:07.556 +00:00',
          updated_at: '2019-02-12 07:49:07.556 +00:00',
        },
        {
          id: '73ee0056-6163-41e4-b18e-a6276551d75e',
          item_id: 'a810b8db-6d04-4697-bed3-c4b72c996279',
          item_type: 'service',
          data: Buffer.from(JSON.stringify({ username: 'service_username', password: 'service_password' })).toString(
            'base64',
          ),
          created_at: '2019-02-12 07:49:07.556 +00:00',
          updated_at: '2019-02-12 07:49:07.556 +00:00',
        },
      ],
      {},
    ),

  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('t_credential', null, {}),
};
