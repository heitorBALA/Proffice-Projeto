import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Alunos from './pages/Alunos';
import Cursos from './pages/Cursos';
import Turmas from './pages/Turmas';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/alunos" element={<Alunos />} />
            <Route path="/cursos" element={<Cursos />} />
            <Route path="/turmas" element={<Turmas />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
