const { Route, setControllerRoot } = require('../../lib/route');
const express = require('express');

setControllerRoot('@/app/controllers');

class ExampleController {
  execute() { }
}

class ResourcesController {
  index(req, res) {
  }

  create(req, res) {
  }

  store(req, res) {
  }

  show(req, res) {
  }

  edit(req, res) {
  }

  update(req, res) {
  }

  destroy(req, res) {
  }  
}

test('should call [controller]@[action]', () => {
  const getProcess = jest.fn(() => {});
  const actionCaller = () => {};
  getProcess.mockReturnValueOnce(actionCaller);
  ExampleController.getProcess = getProcess;

  const routerGet = jest.fn(() => {});
  const router = express.Router();
  router.get = routerGet;

  const requireController = jest.fn(() => {});
  requireController.mockReturnValueOnce(ExampleController);
  const route = new Route(router);
  route.requireController = requireController;

  route.get('/test/action', 'example_controller@execute');

  expect(routerGet.mock.calls).toHaveLength(1);
  expect(routerGet.mock.calls[0][0]).toBe('/test/action');
  expect(routerGet.mock.calls[0][1]).toBe(actionCaller);

  expect(requireController.mock.calls).toHaveLength(1);
  expect(requireController.mock.calls[0][0]).toBe('@/app/controllers/example_controller.js');

  expect(getProcess.mock.calls).toHaveLength(1);
  expect(getProcess.mock.calls[0][0]).toBe('execute');
});

test('should call [controller]@[action] with middleware', () => {
  const getProcess = jest.fn(() => {});
  const actionCaller = () => {};
  getProcess.mockReturnValueOnce(actionCaller);
  ExampleController.getProcess = getProcess;

  const routerGet = jest.fn(() => {});
  const router = express.Router();
  router.get = routerGet;

  const middleware = jest.fn(() => {});

  const requireController = jest.fn(() => {});
  requireController.mockReturnValueOnce(ExampleController);
  const route = new Route(router);
  route.requireController = requireController;

  route.get('/test/action', middleware, 'example_controller@execute');

  expect(routerGet.mock.calls).toHaveLength(1);
  expect(routerGet.mock.calls[0][0]).toBe('/test/action');
  expect(routerGet.mock.calls[0][1]).toBe(middleware);
  expect(routerGet.mock.calls[0][2]).toBe(actionCaller);

  expect(requireController.mock.calls).toHaveLength(1);
  expect(requireController.mock.calls[0][0]).toBe('@/app/controllers/example_controller.js');

  expect(getProcess.mock.calls).toHaveLength(1);
  expect(getProcess.mock.calls[0][0]).toBe('execute');
});

test('should call [dir]/[controller]@[action]', () => {
  const getProcess = jest.fn(() => {});
  const actionCaller = () => {};
  getProcess.mockReturnValueOnce(actionCaller);
  ExampleController.getProcess = getProcess;

  const routerGet = jest.fn(() => {});
  const router = express.Router();
  router.get = routerGet;

  const requireController = jest.fn(() => {});
  requireController.mockReturnValueOnce(ExampleController);
  const route = new Route(router);
  route.requireController = requireController;

  route.get('/test/action', 'admin/example_controller@execute');

  expect(routerGet.mock.calls).toHaveLength(1);
  expect(routerGet.mock.calls[0][0]).toBe('/test/action');
  expect(routerGet.mock.calls[0][1]).toBe(actionCaller);

  expect(requireController.mock.calls).toHaveLength(1);
  expect(requireController.mock.calls[0][0]).toBe('@/app/controllers/admin/example_controller.js');

  expect(getProcess.mock.calls).toHaveLength(1);
  expect(getProcess.mock.calls[0][0]).toBe('execute');
});

test('should call resource actions', () => {
  const getProcess = jest.fn(() => {});
  const actionCaller = () => {};
  getProcess.mockReturnValue(actionCaller);
  ResourcesController.getProcess = getProcess;

  const routerGet = jest.fn(() => {});
  const routerPost = jest.fn(() => {});
  const routerPut = jest.fn(() => {});
  const routerPatch = jest.fn(() => {});
  const routerDelete = jest.fn(() => {});
  const router = express.Router();
  router.get = routerGet;
  router.post = routerPost;
  router.put = routerPut;
  router.patch = routerPatch;
  router.delete = routerDelete;

  const requireController = jest.fn(() => {});
  requireController.mockReturnValue(ResourcesController);
  const route = new Route(router);
  route.requireController = requireController;

  route.resource('resources', 'resources_controller');

  expect(routerGet.mock.calls).toHaveLength(4);
  expect(routerGet.mock.calls[0][0]).toBe('/resources/create');
  expect(routerGet.mock.calls[0][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[1][0]).toBe('/resources/:resource/edit');
  expect(routerGet.mock.calls[1][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[2][0]).toBe('/resources/:resource');
  expect(routerGet.mock.calls[2][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[3][0]).toBe('/resources');
  expect(routerGet.mock.calls[3][1]).toBe(actionCaller);

  expect(routerPost.mock.calls).toHaveLength(1);
  expect(routerPost.mock.calls[0][0]).toBe('/resources');
  expect(routerPost.mock.calls[0][1]).toBe(actionCaller);

  expect(routerPut.mock.calls).toHaveLength(1);
  expect(routerPut.mock.calls[0][0]).toBe('/resources/:resource');
  expect(routerPut.mock.calls[0][1]).toBe(actionCaller);

  expect(routerPatch.mock.calls).toHaveLength(1);
  expect(routerPatch.mock.calls[0][0]).toBe('/resources/:resource');
  expect(routerPatch.mock.calls[0][1]).toBe(actionCaller);

  expect(routerDelete.mock.calls).toHaveLength(1);
  expect(routerDelete.mock.calls[0][0]).toBe('/resources/:resource');
  expect(routerDelete.mock.calls[0][1]).toBe(actionCaller);

  expect(requireController.mock.calls).toHaveLength(8);
  expect(requireController.mock.calls[0][0]).toBe('@/app/controllers/resources_controller.js');

  expect(getProcess.mock.calls).toHaveLength(8);
  expect(getProcess.mock.calls[0][0]).toBe('create');
  expect(getProcess.mock.calls[1][0]).toBe('edit');
  expect(getProcess.mock.calls[2][0]).toBe('show');
  expect(getProcess.mock.calls[3][0]).toBe('index');
  expect(getProcess.mock.calls[4][0]).toBe('store');
  expect(getProcess.mock.calls[5][0]).toBe('update');
  expect(getProcess.mock.calls[6][0]).toBe('update');
  expect(getProcess.mock.calls[7][0]).toBe('destroy');
});

test('should call [/dir]/[resource] actions', () => {
  const getProcess = jest.fn(() => {});
  const actionCaller = () => {};
  getProcess.mockReturnValue(actionCaller);
  ResourcesController.getProcess = getProcess;

  const routerGet = jest.fn(() => {});
  const routerPost = jest.fn(() => {});
  const routerPut = jest.fn(() => {});
  const routerPatch = jest.fn(() => {});
  const routerDelete = jest.fn(() => {});
  const router = express.Router();
  router.get = routerGet;
  router.post = routerPost;
  router.put = routerPut;
  router.patch = routerPatch;
  router.delete = routerDelete;

  const requireController = jest.fn(() => {});
  requireController.mockReturnValue(ResourcesController);
  const route = new Route(router);
  route.requireController = requireController;

  route.resource('test/resources', 'resources_controller');

  expect(routerGet.mock.calls).toHaveLength(4);
  expect(routerGet.mock.calls[0][0]).toBe('/test/resources/create');
  expect(routerGet.mock.calls[0][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[1][0]).toBe('/test/resources/:resource/edit');
  expect(routerGet.mock.calls[1][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[2][0]).toBe('/test/resources/:resource');
  expect(routerGet.mock.calls[2][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[3][0]).toBe('/test/resources');
  expect(routerGet.mock.calls[3][1]).toBe(actionCaller);

  expect(routerPost.mock.calls).toHaveLength(1);
  expect(routerPost.mock.calls[0][0]).toBe('/test/resources');
  expect(routerPost.mock.calls[0][1]).toBe(actionCaller);

  expect(routerPut.mock.calls).toHaveLength(1);
  expect(routerPut.mock.calls[0][0]).toBe('/test/resources/:resource');
  expect(routerPut.mock.calls[0][1]).toBe(actionCaller);

  expect(routerPatch.mock.calls).toHaveLength(1);
  expect(routerPatch.mock.calls[0][0]).toBe('/test/resources/:resource');
  expect(routerPatch.mock.calls[0][1]).toBe(actionCaller);

  expect(routerDelete.mock.calls).toHaveLength(1);
  expect(routerDelete.mock.calls[0][0]).toBe('/test/resources/:resource');
  expect(routerDelete.mock.calls[0][1]).toBe(actionCaller);

  expect(requireController.mock.calls).toHaveLength(8);
  expect(requireController.mock.calls[0][0]).toBe('@/app/controllers/resources_controller.js');

  expect(getProcess.mock.calls).toHaveLength(8);
  expect(getProcess.mock.calls[0][0]).toBe('create');
  expect(getProcess.mock.calls[1][0]).toBe('edit');
  expect(getProcess.mock.calls[2][0]).toBe('show');
  expect(getProcess.mock.calls[3][0]).toBe('index');
  expect(getProcess.mock.calls[4][0]).toBe('store');
  expect(getProcess.mock.calls[5][0]).toBe('update');
  expect(getProcess.mock.calls[6][0]).toBe('update');
  expect(getProcess.mock.calls[7][0]).toBe('destroy');
});

test('should call resource actions with dir/controller', () => {
  const getProcess = jest.fn(() => {});
  const actionCaller = () => {};
  getProcess.mockReturnValue(actionCaller);
  ResourcesController.getProcess = getProcess;

  const routerGet = jest.fn(() => {});
  const routerPost = jest.fn(() => {});
  const routerPut = jest.fn(() => {});
  const routerPatch = jest.fn(() => {});
  const routerDelete = jest.fn(() => {});
  const router = express.Router();
  router.get = routerGet;
  router.post = routerPost;
  router.put = routerPut;
  router.patch = routerPatch;
  router.delete = routerDelete;

  const requireController = jest.fn(() => {});
  requireController.mockReturnValue(ResourcesController);
  const route = new Route(router);
  route.requireController = requireController;

  route.resource('resources', 'test/resources_controller');

  expect(routerGet.mock.calls).toHaveLength(4);
  expect(routerGet.mock.calls[0][0]).toBe('/resources/create');
  expect(routerGet.mock.calls[0][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[1][0]).toBe('/resources/:resource/edit');
  expect(routerGet.mock.calls[1][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[2][0]).toBe('/resources/:resource');
  expect(routerGet.mock.calls[2][1]).toBe(actionCaller);
  expect(routerGet.mock.calls[3][0]).toBe('/resources');
  expect(routerGet.mock.calls[3][1]).toBe(actionCaller);

  expect(routerPost.mock.calls).toHaveLength(1);
  expect(routerPost.mock.calls[0][0]).toBe('/resources');
  expect(routerPost.mock.calls[0][1]).toBe(actionCaller);

  expect(routerPut.mock.calls).toHaveLength(1);
  expect(routerPut.mock.calls[0][0]).toBe('/resources/:resource');
  expect(routerPut.mock.calls[0][1]).toBe(actionCaller);

  expect(routerPatch.mock.calls).toHaveLength(1);
  expect(routerPatch.mock.calls[0][0]).toBe('/resources/:resource');
  expect(routerPatch.mock.calls[0][1]).toBe(actionCaller);

  expect(routerDelete.mock.calls).toHaveLength(1);
  expect(routerDelete.mock.calls[0][0]).toBe('/resources/:resource');
  expect(routerDelete.mock.calls[0][1]).toBe(actionCaller);

  expect(requireController.mock.calls).toHaveLength(8);
  expect(requireController.mock.calls[0][0]).toBe('@/app/controllers/test/resources_controller.js');

  expect(getProcess.mock.calls).toHaveLength(8);
  expect(getProcess.mock.calls[0][0]).toBe('create');
  expect(getProcess.mock.calls[1][0]).toBe('edit');
  expect(getProcess.mock.calls[2][0]).toBe('show');
  expect(getProcess.mock.calls[3][0]).toBe('index');
  expect(getProcess.mock.calls[4][0]).toBe('store');
  expect(getProcess.mock.calls[5][0]).toBe('update');
  expect(getProcess.mock.calls[6][0]).toBe('update');
  expect(getProcess.mock.calls[7][0]).toBe('destroy');
});