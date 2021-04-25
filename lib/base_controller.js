const debug = require('debug')('express-mvc:base_controller');

class BaseController {
  static getProcess(actionName, controllerPath) {
    const fullName = `${controllerPath}@${actionName}`;

    const actionCaller = {
      [fullName]: async (req, res, _next) => {
        debug(`${controllerPath}@${actionName}`);
        const controller = new this();
        await controller[actionName](req, res);
      }
    }[fullName];
    return actionCaller;
  }
}

module.exports = BaseController;