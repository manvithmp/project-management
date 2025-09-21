const request = require('supertest');
const app = require('../server');
const token = ''; 

describe('Task API', () => {
  it('should create a new task', async () => {
    const res = await request(app)
      .post('/api/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Task',
        description: 'Task description',
        project_id: 1,
        assigned_to: 1,
        priority: 'medium',
        status: 'todo',
        deadline: '2025-10-01T12:00:00Z',
      });
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('taskId');
  });

  it('should get all tasks', async () => {
    const res = await request(app)
      .get('/api/tasks')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.tasks)).toBe(true);
  });
});
