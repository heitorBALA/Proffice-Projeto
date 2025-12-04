import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { alunosAPI, cursosAPI, turmasAPI } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    alunos: 0,
    cursos: 0,
    turmas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [alunosRes, cursosRes, turmasRes] = await Promise.all([
        alunosAPI.getAll(),
        cursosAPI.getAll(),
        turmasAPI.getAll(),
      ]);
      
      setStats({
        alunos: alunosRes.data.length,
        cursos: cursosRes.data.length,
        turmas: turmasRes.data.length,
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: 'Total de Alunos',
      value: stats.alunos,
      icon: '👨‍🎓',
      gradient: 'var(--gradient-primary)',
      link: '/alunos',
    },
    {
      title: 'Total de Cursos',
      value: stats.cursos,
      icon: '📚',
      gradient: 'var(--gradient-secondary)',
      link: '/cursos',
    },
    {
      title: 'Total de Turmas',
      value: stats.turmas,
      icon: '🏫',
      gradient: 'var(--gradient-accent)',
      link: '/turmas',
    },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-xl">
        <h1 className="text-3xl font-bold mb-sm">Dashboard</h1>
        <p className="text-muted">Bem-vindo ao Sistema de Gerenciamento Proffice</p>
      </div>

      <div className="grid grid-3 mb-xl">
        {statCards.map((card, index) => (
          <Link to={card.link} key={index} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ background: card.gradient, color: 'white' }}>
              <div className="flex items-center justify-between mb-md">
                <span style={{ fontSize: '3rem' }}>{card.icon}</span>
                <div className="text-right">
                  <div style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: '1' }}>
                    {card.value}
                  </div>
                </div>
              </div>
              <h3 className="text-lg font-semibold">{card.title}</h3>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-2">
        <div className="card">
          <h2 className="text-xl font-bold mb-lg">Ações Rápidas</h2>
          <div className="flex flex-col gap-md">
            <Link to="/alunos" className="btn btn-primary">
              <span>➕</span>
              Adicionar Novo Aluno
            </Link>
            <Link to="/cursos" className="btn btn-secondary">
              <span>➕</span>
              Adicionar Novo Curso
            </Link>
            <Link to="/turmas" className="btn btn-secondary">
              <span>➕</span>
              Adicionar Nova Turma
            </Link>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-lg">Sobre o Sistema</h2>
          <p className="text-muted mb-md">
            O Proffice é um sistema completo de gerenciamento educacional que permite
            administrar alunos, cursos e turmas de forma eficiente e intuitiva.
          </p>
          <div className="flex flex-col gap-sm">
            <div className="flex items-center gap-sm">
              <span>✅</span>
              <span>Gerenciamento de Alunos</span>
            </div>
            <div className="flex items-center gap-sm">
              <span>✅</span>
              <span>Controle de Cursos</span>
            </div>
            <div className="flex items-center gap-sm">
              <span>✅</span>
              <span>Organização de Turmas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
