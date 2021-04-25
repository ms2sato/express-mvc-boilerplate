const debug = require('debug')('express-mvc:base_controller');

class BaseController {
  static getProcess(actionName, controllerPath) {
    const fullName = `${controllerPath}@${actionName}`;

    const actionCaller = {
      [fullName]: async (req, res, _next) => {
        debug(fullName);
        const controller = new this();
        await controller[actionName](req, res);
      }
    }[fullName]; // for function with name

    return actionCaller;
  }
}

module.exports = BaseController;