const { Route } = require('../../lib/route');
const express = require('express');

class ExampleController {
  execute() { }
}

test('should call [controller]@[action]', () => {
  const getProcess = jest.fn(() => {});
  const actionCaller = () => {};
  getProcess.mockReturnValueOnce(actionCaller);
  ExampleController.getProcess = getProcess;

  const routerGet = jest.fn(() => {});
  const router = express.Router();
  router.get = routerGet;

  const route = new Route(router);
  route.loadController = () => {
    return ExampleController;
  };
  route.get('/test/action', 'example_controller@execute');

  expect(routerGet.mock.calls).toHaveLength(1);
  expect(routerGet.mock.calls[0][0]).toBe('/test/action');
  expect(routerGet.mock.calls[0][1]).toBe(actionCaller);

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

  const route = new Route(router);
  route.loadController = () => {
    return ExampleController;
  };
  route.get('/test/action', middleware, 'example_controller@execute');

  expect(routerGet.mock.calls).toHaveLength(1);
  expect(routerGet.mock.calls[0][0]).toBe('/test/action');
  expect(routerGet.mock.calls[0][1]).toBe(middleware);
  expect(routerGet.mock.calls[0][2]).toBe(actionCaller);

  expect(getProcess.mock.calls).toHaveLength(1);
  expect(getProcess.mock.calls[0][0]).toBe('execute');
});