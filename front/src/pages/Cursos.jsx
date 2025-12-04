import { useState, useEffect } from 'react';
import { cursosAPI } from '../services/api';

const Cursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCurso, setEditingCurso] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cargaHoraria: '',
    modalidade: 'Presencial',
    coordenador: '',
  });

  useEffect(() => {
    loadCursos();
  }, []);

  const loadCursos = async () => {
    try {
      const response = await cursosAPI.getAll();
      setCursos(response.data);
    } catch (error) {
      console.error('Erro ao carregar cursos:', error);
      alert('Erro ao carregar cursos. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const cursoData = {
        ...formData,
        cargaHoraria: parseInt(formData.cargaHoraria),
      };

      if (editingCurso) {
        await cursosAPI.update(editingCurso.idCurso, cursoData);
      } else {
        await cursosAPI.create(cursoData);
      }
      
      loadCursos();
      closeModal();
    } catch (error) {
      console.error('Erro ao salvar curso:', error);
      alert('Erro ao salvar curso. Verifique os dados e tente novamente.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este curso?')) {
      try {
        await cursosAPI.delete(id);
        loadCursos();
      } catch (error) {
        console.error('Erro ao deletar curso:', error);
        alert('Erro ao deletar curso.');
      }
    }
  };

  const openModal = (curso = null) => {
    if (curso) {
      setEditingCurso(curso);
      setFormData({
        nome: curso.nome || '',
        descricao: curso.descricao || '',
        cargaHoraria: curso.cargaHoraria || '',
        modalidade: curso.modalidade || 'Presencial',
        coordenador: curso.coordenador || '',
      });
    } else {
      setEditingCurso(null);
      setFormData({
        nome: '',
        descricao: '',
        cargaHoraria: '',
        modalidade: 'Presencial',
        coordenador: '',
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCurso(null);
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
          <h1 className="text-3xl font-bold mb-sm">Gerenciamento de Cursos</h1>
          <p className="text-muted">Cadastre e gerencie os cursos oferecidos</p>
        </div>
        <button onClick={() => openModal()} className="btn btn-primary btn-lg">
          <span>➕</span>
          Novo Curso
        </button>
      </div>

      <div className="grid grid-2">
        {cursos.length === 0 ? (
          <div className="card">
            <p className="text-center text-muted">Nenhum curso cadastrado</p>
          </div>
        ) : (
          cursos.map((curso) => (
            <div key={curso.idCurso} className="card">
              <div className="flex justify-between items-start mb-md">
                <div>
                  <h3 className="text-xl font-bold mb-sm">{curso.nome}</h3>
                  <span className="badge badge-primary">{curso.modalidade}</span>
                </div>
              </div>
              
              <p className="text-muted mb-md">{curso.descricao}</p>
              
              <div className="flex flex-col gap-sm mb-lg">
                <div className="flex items-center gap-sm">
                  <span>⏱️</span>
                  <span className="text-sm">Carga Horária: {curso.cargaHoraria}h</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span>👤</span>
                  <span className="text-sm">Coordenador: {curso.coordenador}</span>
                </div>
                <div className="flex items-center gap-sm">
                  <span>🏫</span>
                  <span className="text-sm">
                    Turmas: {curso.turmas?.length || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-sm">
                <button
                  onClick={() => openModal(curso)}
                  className="btn btn-sm btn-secondary"
                >
                  ✏️ Editar
                </button>
                <button
                  onClick={() => handleDelete(curso.idCurso)}
                  className="btn btn-sm btn-danger"
                >
                  🗑️ Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">
                {editingCurso ? 'Editar Curso' : 'Novo Curso'}
              </h2>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Nome do Curso *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Descrição</label>
                <textarea
                  className="form-textarea"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="grid grid-2">
                <div className="form-group">
                  <label className="form-label">Carga Horária (horas) *</label>
                  <input
                    type="number"
                    className="form-input"
                    value={formData.cargaHoraria}
                    onChange={(e) => setFormData({ ...formData, cargaHoraria: e.target.value })}
                    required
                    min="1"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Modalidade *</label>
                  <select
                    className="form-select"
                    value={formData.modalidade}
                    onChange={(e) => setFormData({ ...formData, modalidade: e.target.value })}
                    required
                  >
                    <option value="Presencial">Presencial</option>
                    <option value="EAD">EAD</option>
                    <option value="Híbrido">Híbrido</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Coordenador *</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.coordenador}
                  onChange={(e) => setFormData({ ...formData, coordenador: e.target.value })}
                  required
                />
              </div>

              <div className="modal-footer">
                <button type="button" onClick={closeModal} className="btn btn-secondary">
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCurso ? 'Atualizar' : 'Cadastrar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cursos;
