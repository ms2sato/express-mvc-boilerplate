const path = require('path');
const fs = require('fs');
const debug = require('debug')('express-mvc:route');
const pluralize = require('pluralize');

const controllerRoot = path.join(__dirname, '../app/controllers');

class Route {
  constructor(router = require('express').Router()) {
    this.router = router;
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

  options(urlPath, action) {
    return this.registerAction('options', urlPath, action);
  }

  resource(name, controllerPath) {
    // TODO: nested resource

    const singlerName = pluralize.singular(name);

    const paramsList = [
      ['get', `/${name}/create`, controllerPath, 'create'],
      ['get', `/${name}/:${singlerName}/edit`, controllerPath, 'edit'],
      ['get', `/${name}/:${singlerName}`, controllerPath, 'show'],
      ['get', `/${name}`, controllerPath, 'index'],
      ['post', `/${name}`, controllerPath, 'store'],
      ['patch', `/${name}/:${singlerName}`, controllerPath, 'update'],
      ['put', `/${name}/:${singlerName}`, controllerPath, 'update'],
      ['delete', `/${name}/:${singlerName}`, controllerPath, 'destroy']
    ];

    paramsList.forEach((params)=> {
      this.applyRoute.apply(this, params);
    });
  }

  registerAction(httpMethod, urlPath, action) {
    // TODO: middlewareとしてのactionが複数あることに対応すること
    if(typeof action === 'string') {
      const [controllerPath, actionName] = action.split('@');
      if(!actionName) {
        throw new Error(`actionのフォーマットはクラスファイル名@メソッド名です。「@」が入っていません: ${action}`);
      }

      this.applyRoute(httpMethod, urlPath, controllerPath, actionName);
    } else {
      debug(`${httpMethod} ${urlPath} ${action}`);
      this.router[httpMethod](urlPath, action);
    }
    return this;
  }

  applyRoute(httpMethod, urlPath, controllerPath, actionName) {
    const Controller = this.loadController(controllerPath, actionName);
    // TODO クラスがメソッドを所有しているかを継承階層も辿れるようなチェックをする
    if(!Controller.prototype[actionName]) {
      throw new Error(`${controllerPath}に指定のactionがありません: ${actionName}`);
    }

    debug(`${httpMethod} ${urlPath} ${controllerPath}@${actionName}`);
    return this.router[httpMethod](urlPath, Controller.getProcess(actionName));
  }

  loadController(controllerPath) {
    // TODO: コントローラの名前空間対応
    const controllerFullPath = path.join(controllerRoot, `${controllerPath}.js`);
    if(!fs.existsSync(controllerFullPath)) {
      throw new Error(`Controllerファイルが見つかりませんでした: ${controllerFullPath}`);
    }
    return require(controllerFullPath);
  }
}

module.exports = { Route };