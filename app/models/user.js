'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(_models) {
      // define association here
    }

    static async signIn(params) {
      const user = await this.findOne({ where: { provider: params.provider, uid: params.uid } });
      if(user) {
        user.username = params.username;
        user.accessToken = params.accessToken;
        user.refreshToken = params.refreshToken;
        await user.save();
        return user;
      } else {
        return await this.create(params);
      }
    }
  }
  User.init({
    provider: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    uid: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    email:  {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    displayName:  {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true
      }
    },
    accessToken:  {
      type: DataTypes.TEXT,
      validate: {
        notEmpty: true
      }
    },
    refreshToken:  {
      type: DataTypes.TEXT
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};