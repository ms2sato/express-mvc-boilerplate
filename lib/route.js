const path = require('path');
const fs = require('fs');
const debug = require('debug')('express-mvc:route');
const pluralize = require('pluralize');

let controllerRoot = path.join(__dirname, '../app/controllers');

class Route {
  constructor(router = require('express').Router()) {
    this.router = router;
  }

  resource(name, ...args) {
    // TODO: nested resource

    if(name.startsWith('/')) {
      throw new Error('resourceの名前は「/」から始まってはいけません');
    }

    const singlerName = pluralize.singular(name.split('/').pop());

    const controllerPath = args.pop();

    // TODO: 文字連結は本当はしたくないが実装を一貫させることを優先。
    const paramsList = [
      ['get', `/${name}/create`, [...args, `${controllerPath}@create`]],
      ['get', `/${name}/:${singlerName}/edit`, [...args, `${controllerPath}@edit`]],
      ['get', `/${name}/:${singlerName}`, [...args, `${controllerPath}@show`]],
      ['get', `/${name}`, [...args, `${controllerPath}@index`]],
      ['post', `/${name}`, [...args, `${controllerPath}@store`]],
      ['patch', `/${name}/:${singlerName}`, [...args, `${controllerPath}@update`]],
      ['put', `/${name}/:${singlerName}`, [...args, `${controllerPath}@update`]],
      ['delete', `/${name}/:${singlerName}`, [...args, `${controllerPath}@destroy`]]
    ];

    paramsList.forEach((params) => {
      this.registerAction.apply(this, params);
    });
  }

  registerAction(httpMethod, urlPath, middlewares) {
    const routerParams = middlewares.map((middleware) => {
      if (typeof middleware === 'string') {
        const [controllerPath, actionName] = middleware.split('@');
        if (!actionName) {
          throw new Error(`actionのフォーマットはクラスファイル名@メソッド名です。「@」が入っていません: ${middleware}`);
        }
        return this.getActionProcess(controllerPath, actionName);
      } else {
        return middleware;
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
    return this.requireController(path.join(controllerRoot, `${controllerPath}.js`));
  }

  requireController(controllerFullPath) {
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

function setControllerRoot(root) {
  controllerRoot = root;
}

module.exports = { Route, setControllerRoot };