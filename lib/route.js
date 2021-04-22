const path = require('path');
const fs = require('fs')

const controllerRoot = path.join(__dirname, '../app/controllers');

class Route {
  constructor(router = require('express').Router()) {
    this.router = router
  }

  get(urlPath, action) {
    return this.registerAction('get', urlPath, action);
  }

  post(urlPath, action) {
    return this.registerAction('post', urlPath, action);
  }

  put(urlPath, action) {
    return this.registerAction('put', urlPath, action);
  }

  patch(urlPath, action) {
    return this.registerAction('patch', urlPath, action);
  }

  delete(urlPath, action) {
    return this.registerAction('delete', urlPath, action);
  }

  registerAction(method, urlPath, action) {
    // TODO: middlewareとしてのactionが複数あることに対応すること
    if(typeof action === 'string') {
      const [Controller, actionName] = this.loadController(action);
      return this.router[method](urlPath, Controller.getProcess(actionName));
    } else {
      return this.router[method](urlPath, action);
    }
  }

  loadController(action) {
    const [classPath, actionName] = action.split('@')
    if(!actionName) {
      throw new Error(`actionのフォーマットはクラスファイル名@メソッド名です。「@」が入っていません: ${action}`);
    }

    // TODO: コントローラの名前空間対応
    const controllerPath = path.join(controllerRoot, `${classPath}.js`)
    if(!fs.existsSync(controllerPath)) {
      throw new Error(`Controllerファイルが見つかりませんでした: ${controllerPath}`);
    }

    const Controller = require(controllerPath);
    // TODO クラスがメソッドを所有しているかを継承階層も辿れるようなチェックをする
    if(!Controller.prototype[actionName]) {
      throw new Error(`${controllerPath}に指定のactionがありません: ${actionName}`);
    }

    return [Controller, actionName];
  }
}

module.exports = { Route }