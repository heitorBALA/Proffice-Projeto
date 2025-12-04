import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', icon: '📊', label: 'Dashboard' },
    { path: '/alunos', icon: '👨‍🎓', label: 'Alunos' },
    { path: '/cursos', icon: '📚', label: 'Cursos' },
    { path: '/turmas', icon: '🏫', label: 'Turmas' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h1 className="sidebar-logo">
          <span className="logo-icon">🎓</span>
          Proffice
        </h1>
      </div>
      
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>
          </Link>
        ))}
      </nav>
      
      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">👤</div>
          <div className="user-info">
            <div className="user-name">Admin</div>
            <div className="user-role">Sistema Proffice</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
