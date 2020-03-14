const { ITEMS_LIST } = require('../utils/constants');

const beforeTransform = (c) => {
  c.data = Buffer.from(JSON.stringify(c.data)).toString('base64');
};

const afterTransform = (c) => {
  c.data = JSON.parse(Buffer.from(c.data, 'base64').toString());
};

module.exports = (sequelize, DataTypes) => {
  const credential = sequelize.define(
    't_credential',
    {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      item_id: {
        allowNull: false,
        type: DataTypes.UUID,
      },
      item_type: {
        allowNull: false,
        type: DataTypes.ENUM(ITEMS_LIST),
      },
      data: {
        allowNull: false,
        type: DataTypes.STRING,
      },
    },
    {},
  );

  credential.beforeValidate(beforeTransform);
  credential.afterValidate(afterTransform);

  credential.beforeSave(beforeTransform);
  credential.afterSave(afterTransform);

  return credential;
};
