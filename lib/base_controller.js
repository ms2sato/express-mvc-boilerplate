class BaseController {
  static getProcess(actionName) {
    return async (req, res, next) => {
      const controller = new this()
      await controller[actionName](req, res)
    }
  }
}

module.exports = BaseController;