const path = require('path');
const fs = require('fs');
const debug = require('debug')('express-mvc:route');
const pluralize = require('pluralize');

const controllerRoot = path.join(__dirname, '../app/controllers');

class Route {
  constructor(router = require('express').Router()) {
    this.router = router;
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

    paramsList.forEach((params) => {
      this.applyRoute.apply(this, params);
    });
  }

  registerAction(httpMethod, urlPath, paramsList) {
    const routerParams = paramsList.map((params) => {
      if (typeof params === 'string') {
        const [controllerPath, actionName] = params.split('@');
        if (!actionName) {
          throw new Error(`actionのフォーマットはクラスファイル名@メソッド名です。「@」が入っていません: ${params}`);
        }
        return this.getActionProcess(controllerPath, actionName);
      } else {
        return params;
      }
    });

    const displayParams = routerParams.map(param => {
      return param.name ? param.name : param.toString();
    });
    debug(`${httpMethod} ${urlPath} ${JSON.stringify(displayParams)}`);
    this.router[httpMethod].apply(this.router, [urlPath, ...routerParams]);
    return this;
  }

  getActionProcess(controllerPath, actionName) {
    const Controller = this.loadController(controllerPath, actionName);
    // TODO クラスがメソッドを所有しているかを継承階層も辿れるようなチェックをする
    if (!Controller.prototype[actionName]) {
      throw new Error(`${controllerPath}に指定のactionがありません: ${actionName}`);
    }
    return Controller.getProcess(actionName, controllerPath);
  }

  applyRoute(httpMethod, urlPath, controllerPath, actionName) {
    const actionProcess = this.getActionProcess(controllerPath, actionName);
    debug(`${httpMethod} ${urlPath} ${actionProcess.name}`);
    return this.router[httpMethod](urlPath, actionProcess);
  }

  loadController(controllerPath) {
    // TODO: コントローラの名前空間対応
    const controllerFullPath = path.join(controllerRoot, `${controllerPath}.js`);
    if (!fs.existsSync(controllerFullPath)) {
      throw new Error(`Controllerファイルが見つかりませんでした: ${controllerFullPath}`);
    }
    return require(controllerFullPath);
  }
}

for (const httpMethod of ['get', 'post', 'put', 'patch', 'delete', 'options', 'head']) {
  Route.prototype[httpMethod] = function (urlPath, ...paramsList) {
    return this.registerAction(httpMethod, urlPath, paramsList);
  };
}

module.exports = { Route };