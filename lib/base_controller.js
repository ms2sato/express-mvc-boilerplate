const debug = require('debug')('express-mvc:base_controller');

class BaseController {
  static getProcess(actionName) {
    const actionCaller = async (req, res, _next) => {
      debug(`${this.name}@${actionName}`);
      const controller = new this();
      await controller[actionName](req, res);
    };
    return actionCaller;
  }
}

module.exports = BaseController;