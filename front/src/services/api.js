import axios from 'axios';

const API_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Alunos API
export const alunosAPI = {
  getAll: () => api.get('/alunos'),
  getById: (id) => api.get(`/alunos/${id}`),
  create: (aluno) => api.post('/alunos', aluno),
  update: (id, aluno) => api.put(`/alunos/${id}`, aluno),
  delete: (id) => api.delete(`/alunos/${id}`),
};

// Cursos API
export const cursosAPI = {
  getAll: () => api.get('/cursos'),
  getById: (id) => api.get(`/cursos/${id}`),
  create: (curso) => api.post('/cursos', curso),
  update: (id, curso) => api.put(`/cursos/${id}`, curso),
  delete: (id) => api.delete(`/cursos/${id}`),
};

// Turmas API
export const turmasAPI = {
  getAll: () => api.get('/turmas'),
  getById: (id) => api.get(`/turmas/${id}`),
  create: (turma) => api.post('/turmas', turma),
  update: (id, turma) => api.put(`/turmas/${id}`, turma),
  delete: (id) => api.delete(`/turmas/${id}`),
};

export default api;
