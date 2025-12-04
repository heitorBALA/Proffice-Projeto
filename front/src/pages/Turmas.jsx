import { useState, useEffect } from 'react';
import { turmasAPI, cursosAPI } from '../services/api';

const Turmas = () => {
  const [turmas, setTurmas] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingTurma, setEditingTurma] = useState(null);
  const [formData, setFormData] = useState({
    codigo: '',
    turno: 'Manhã',
    anoLetivo: new Date().getFullYear(),
    sala: '',
    status: 'Ativa',
    curso: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [turmasRes, cursosRes] = await Promise.all([
        turmasAPI.getAll(),
        cursosAPI.getAll(),
      ]);
      setTurmas(turmasRes.data);
      setCursos(cursosRes.data);
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
      const turmaData = {
        ...formData,
        anoLetivo: parseInt(formData.anoLetivo),
        curso: formData.curso ? { idCurso: parseInt(formData.curso) } : null,
      };

      if (editingTurma) {
        await turmasAPI.update(editingTurma.idTurma, turmaData);
      } else {
        await turmasAPI.create(turmaData);
      }
      
      loadData();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar turma:', error);
      alert('Erro ao salvar turma. Verifique os dados e tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta turma?')) {
      try {
        await turmasAPI.delete(id);
        loadData();
      } catch (error) {
        console.error('Erro ao deletar turma:', error);
        alert('Erro ao deletar turma.');
      }
    }
  };

  const openModal = (turma = null) => {
    if (turma) {
      setEditingTurma(turma);
      setFormData({
        codigo: turma.codigo || '',
        turno: turma.turno || 'Manhã',
        anoLetivo: turma.anoLetivo || new Date().getFullYear(),
        sala: turma.sala || '',
        status: turma.status || 'Ativa',
        curso: turma.curso?.idCurso || '',
      });
    } else {
      setEditingTurma(null);
      setFormData({
        codigo: '',
        turno: 'Manhã',
        anoLetivo: new Date().getFullYear(),
        sala: '',
        status: 'Ativa',
        curso: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTurma(null);
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
          <h1 className="text-3xl font-bold mb-sm">Gerenciamento de Turmas</h1>
          <p className="text-muted">Organize e gerencie as turmas do sistema</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary btn-lg">
          <span>➕</span>
          Nova Turma
        </button>
      </div>

      <div className="card">
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Curso</th>
                <th>Turno</th>
                <th>Ano Letivo</th>
                <th>Sala</th>
                <th>Alunos</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {turmas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center text-muted">
                    Nenhuma turma cadastrada
                  </td>
                </tr>
              ) : (
                turmas.map((turma) => (
                  <tr key={turma.idTurma}>
                    <td className="font-semibold">{turma.codigo}</td>
                    <td>{turma.curso?.nome || '-'}</td>
                    <td>{turma.turno}</td>
                    <td>{turma.anoLetivo}</td>
                    <td>{turma.sala}</td>
                    <td>{turma.alunos?.length || 0}</td>
                    <td>
                      <span className={`badge ${
                        turma.status === 'Ativa' ? 'badge-success' : 'badge-warning'
                      }`}>
                        {turma.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-sm">
                        <button
                          onClick={() => openModal(turma)}
                          className="btn btn-sm btn-secondary"
                        >
                          ✏️ Editar
                        </button>
                        <button
                          onClick={() => handleDelete(turma.idTurma)}
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
                {editingTurma ? 'Editar Turma' : 'Nova Turma'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Código da Turma *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.codigo}
                    onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                    required
                    placeholder="Ex: TUR-2024-01"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Curso *</label>
                  <select
                    className="form-select"
                    value={formData.curso}
                    onChange={(e) => setFormData({ ...formData, curso: e.target.value })}
                    required
                  >
                    <option value="">Selecione um curso</option>
                    {cursos.map((curso) => (
                      <option key={curso.idCurso} value={curso.idCurso}>
                        {curso.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Turno *</label>
                  <select
                    className="form-select"
                    value={formData.turno}
                    onChange={(e) => setFormData({ ...formData, turno: e.target.value })}
                    required
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Noite">Noite</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Ano Letivo *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.anoLetivo}
                    onChange={(e) => setFormData({ ...formData, anoLetivo: e.target.value })}
                    required
                    min="2000"
                    max="2100"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Sala *</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.sala}
                    onChange={(e) => setFormData({ ...formData, sala: e.target.value })}
                    required
                    placeholder="Ex: Sala 101"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Status *</label>
                  <select
                    className="form-select"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    required
                  >
                    <option value="Ativa">Ativa</option>
                    <option value="Inativa">Inativa</option>
                    <option value="Encerrada">Encerrada</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingTurma ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Turmas;
