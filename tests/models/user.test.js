const models = require('../../app/models');

beforeAll(async () => {
  await models.User.sync({ force: true });
});

afterAll(async () => {
  await models.sequelize.close();
});

describe('#isAdmin', () => {
  test('should true for admin', () => {
    const admin = models.User.build({ role: models.User.roles.admin });
    expect(admin.isAdmin()).toBe(true);
  });

  test('should false for normal', () => {
    const normal = models.User.build({ role: models.User.roles.normal });
    expect(normal.isAdmin()).toBe(false);
  });
});
