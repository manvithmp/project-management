const request = require('supertest');
const app = require('../server');

const token = ''; 

describe('Project API', () => {
  it('should create a new project', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Test Project',
        description: 'Test project description',
        start_date: '2025-09-01',
        end_date: '2025-12-01',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('projectId');
  });

  it('should get all projects', async () => {
    const res = await request(app)
      .get('/api/projects')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.projects)).toBe(true);
  });
});
