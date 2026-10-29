const request = require('supertest');
const app = require('./app');
const db = require('./db');

// Mock the database module
jest.mock('./db');

describe('API endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /health', () => {
    it('should return status ok', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'ok' });
    });
  });

  describe('GET /tasks', () => {
    it('should return all tasks ordered by created_at', async () => {
      const mockTasks = [
        { id: 1, title: 'First task', completed: false, created_at: '2024-01-01' },
        { id: 2, title: 'Second task', completed: true, created_at: '2024-01-02' }
      ];
      db.query.mockResolvedValue({ rows: mockTasks });

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockTasks);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM tasks ORDER BY created_at ASC');
    });

    it('should return empty array when no tasks exist', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const response = await request(app).get('/tasks');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /tasks', () => {
    it('should create a new task with valid title', async () => {
      const newTask = { id: 1, title: 'New task', completed: false, created_at: '2024-01-01' };
      db.query.mockResolvedValue({ rows: [newTask] });

      const response = await request(app)
        .post('/tasks')
        .send({ title: 'New task' });

      expect(response.status).toBe(201);
      expect(response.body).toEqual(newTask);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
        ['New task']
      );
    });

    it('should trim whitespace from title', async () => {
      const newTask = { id: 1, title: 'Trimmed task', completed: false, created_at: '2024-01-01' };
      db.query.mockResolvedValue({ rows: [newTask] });

      const response = await request(app)
        .post('/tasks')
        .send({ title: '  Trimmed task  ' });

      expect(response.status).toBe(201);
      expect(db.query).toHaveBeenCalledWith(
        'INSERT INTO tasks (title) VALUES ($1) RETURNING *',
        ['Trimmed task']
      );
    });

    it('should return 400 when title is missing', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'title is required' });
      expect(db.query).not.toHaveBeenCalled();
    });

    it('should return 400 when title is not a string', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: 123 });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'title is required' });
      expect(db.query).not.toHaveBeenCalled();
    });

    it('should return 400 when title is empty or only whitespace', async () => {
      const response = await request(app)
        .post('/tasks')
        .send({ title: '   ' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: 'title is required' });
      expect(db.query).not.toHaveBeenCalled();
    });
  });

  describe('PATCH /tasks/:id', () => {
    it('should update task completion status', async () => {
      const existingTask = { id: 1, title: 'Test task', completed: false };
      const updatedTask = { id: 1, title: 'Test task', completed: true };
      
      db.query
        .mockResolvedValueOnce({ rows: [existingTask] })
        .mockResolvedValueOnce({ rows: [updatedTask] });

      const response = await request(app)
        .patch('/tasks/1')
        .send({ completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(db.query).toHaveBeenCalledWith('SELECT * FROM tasks WHERE id = $1', [1]);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
        [true, 'Test task', 1]
      );
    });

    it('should update task title', async () => {
      const existingTask = { id: 1, title: 'Old title', completed: false };
      const updatedTask = { id: 1, title: 'New title', completed: false };
      
      db.query
        .mockResolvedValueOnce({ rows: [existingTask] })
        .mockResolvedValueOnce({ rows: [updatedTask] });

      const response = await request(app)
        .patch('/tasks/1')
        .send({ title: 'New title' });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
        [false, 'New title', 1]
      );
    });

    it('should update both title and completion status', async () => {
      const existingTask = { id: 1, title: 'Old title', completed: false };
      const updatedTask = { id: 1, title: 'New title', completed: true };
      
      db.query
        .mockResolvedValueOnce({ rows: [existingTask] })
        .mockResolvedValueOnce({ rows: [updatedTask] });

      const response = await request(app)
        .patch('/tasks/1')
        .send({ title: 'New title', completed: true });

      expect(response.status).toBe(200);
      expect(response.body).toEqual(updatedTask);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
        [true, 'New title', 1]
      );
    });

    it('should return 404 when task does not exist', async () => {
      db.query.mockResolvedValue({ rows: [] });

      const response = await request(app)
        .patch('/tasks/999')
        .send({ completed: true });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Not found' });
    });

    it('should preserve existing values when not provided', async () => {
      const existingTask = { id: 1, title: 'Test task', completed: false };
      const updatedTask = { id: 1, title: 'Test task', completed: false };
      
      db.query
        .mockResolvedValueOnce({ rows: [existingTask] })
        .mockResolvedValueOnce({ rows: [updatedTask] });

      const response = await request(app)
        .patch('/tasks/1')
        .send({});

      expect(response.status).toBe(200);
      expect(db.query).toHaveBeenCalledWith(
        'UPDATE tasks SET completed = $1, title = $2 WHERE id = $3 RETURNING *',
        [false, 'Test task', 1]
      );
    });
  });
});
