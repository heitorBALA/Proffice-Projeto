import { useState, useEffect } from 'react';
import { alunosAPI, turmasAPI } from '../services/api';

const Alunos = () => {
  const [alunos, setAlunos] = useState([]);
  const [turmas, setTurmas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAluno, setEditingAluno] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    dataNascimento: '',
    cpf: '',
    email: '',
    telefone: '',
    endereco: '',
    dataMatricula: '',
    status: 'Ativo',
    turma: null,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [alunosRes, turmasRes] = await Promise.all([
        alunosAPI.getAll(),
        turmasAPI.getAll(),
      ]);
      setAlunos(alunosRes.data);
      setTurmas(turmasRes.data);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      alert('Erro ao carregar dados. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const alunoData = {
        ...formData,
        turma: formData.turma ? { idTurma: parseInt(formData.turma) } : null,
      };

      if (editingAluno) {
        await alunosAPI.update(editingAluno.id, alunoData);
      } else {
        await alunosAPI.create(alunoData);
      }
      
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar aluno:', error);
      alert('Erro ao salvar aluno. Verifique os dados e tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este aluno?')) {
      try {
        await alunosAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Erro ao deletar aluno:', error);
        alert('Erro ao deletar aluno.');
      }
    }
  };

  const openModal = (aluno = null) => {
    if (aluno) {
      setEditingAluno(aluno);
      setFormData({
        nome: aluno.nome || '',
        dataNascimento: aluno.dataNascimento || '',
        cpf: aluno.cpf || '',
        email: aluno.email || '',
        telefone: aluno.telefone || '',
        endereco: aluno.endereco || '',
        dataMatricula: aluno.dataMatricula || '',
        status: aluno.status || 'Ativo',
        turma: aluno.turma?.idTurma || '',
      });
    } else {
      setEditingAluno(null);
      setFormData({
        nome: '',
        dataNascimento: '',
        cpf: '',
        email: '',
        telefone: '',
        endereco: '',
        dataMatricula: new Date().toISOString().split('T')[0],
        status: 'Ativo',
        turma: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingAluno(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-xl">
        <div>
          <h1 className="text-3xl font-bold mb-sm">Gerenciamento de Alunos</h1>
          <p className="text-muted">Cadastre e gerencie os alunos do sistema</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary btn-lg">
          <span>➕</span>
          Novo Aluno
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Turma</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {alunos.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center text-muted">
                    Nenhum aluno cadastrado
                  </td>
                </tr>
              ) : (
                alunos.map((aluno) => (
                  <tr key={aluno.id}>
                    <td className="font-semibold">{aluno.nome}</td>
                    <td>{aluno.cpf}</td>
                    <td>{aluno.email}</td>
                    <td>{aluno.telefone}</td>
                    <td>{aluno.turma?.codigo || '-'}</td>
                    <td>
                      <span className={`badge ${
                        aluno.status === 'Ativo' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {aluno.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        <button
                          onClick={() => openModal(aluno)}
                          className="btn btn-sm btn-secondary"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(aluno.id)}
                          className="btn btn-sm btn-danger"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingAluno ? 'Editar Aluno' : 'Novo Aluno'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Nome Completo *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">CPF *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.cpf}
                    onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Nascimento *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dataNascimento}
                    onChange={(e) => setFormData({ ...formData, dataNascimento: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email *</label>
                  <input
                    type="email"
                    className="form-input"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Telefone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Data de Matrícula *</label>
                  <input
                    type="date"
                    className="form-input"
                    value={formData.dataMatricula}
                    onChange={(e) => setFormData({ ...formData, dataMatricula: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Turma</label>
                  <select
                    className="form-select"
                    value={formData.turma}
                    onChange={(e) => setFormData({ ...formData, turma: e.target.value })}
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas.map((turma) => (
                      <option key={turma.idTurma} value={turma.idTurma}>
                        {turma.codigo} - {turma.curso?.nome || 'Sem curso'}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                    <option value="Trancado">Trancado</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Endereço</label>
                <textarea
                  className="form-textarea"
                  value={formData.endereco}
                  onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingAluno ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alunos;
