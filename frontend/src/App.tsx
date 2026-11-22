

import './App.css'

function App() {
  return (
      <div className="app">
        <aside className="sidebar">
          <div className="brand">
            <div className="brand-icon">E</div>
            <div>
              <h2>EquipControl</h2>
              <span>Gestão de equipamentos</span>
            </div>
          </div>

          <nav className="menu">
            <span className="menu-title">MENU PRINCIPAL</span>

            <a href="#" className="menu-item active">▦ Dashboard</a>
            <a href="#" className="menu-item">▣ Equipamentos</a>
            <a href="#" className="menu-item">♙ Colaboradores</a>
            <a href="#" className="menu-item">⇄ Empréstimos</a>
          </nav>

          <div className="sidebar-footer">
            <span> Sistema de Empréstimos</span>
            <small>Versão 1.0.0</small>
          </div>
        </aside>

        <main className="main-content">
          <header className="topbar">
            <div>
              <span className="breadcrumb">Visão geral / Dashboard</span>
              <h1>Dashboard</h1>
            </div>

            <div className="user-info">
              <div className="avatar">A</div>
              <div>
                <strong>Administrador</strong>
                <small>Gestor do sistema</small>
              </div>
            </div>
          </header>

          <section className="welcome">
            <div>
              <h2>Bem-vindo ao EquipControl!</h2>
              <p>Acompanhe os equipamentos e empréstimos da sua empresa.</p>
            </div>
            <span className="welcome-icon">▣</span>
          </section>

          <section className="stats">
            <article className="stat-card">
              <div className="stat-icon blue">▣</div>
              <span>Total de equipamentos</span>
              <strong>--</strong>
              <small>Equipamentos cadastrados</small>
            </article>

            <article className="stat-card">
              <div className="stat-icon green">✓</div>
              <span>Disponíveis</span>
              <strong>--</strong>
              <small>Prontos para empréstimo</small>
            </article>

            <article className="stat-card">
              <div className="stat-icon orange">⇄</div>
              <span>Empréstimos ativos</span>
              <strong>--</strong>
              <small>Equipamentos emprestados</small>
            </article>

            <article className="stat-card">
              <div className="stat-icon red">!</div>
              <span>Em atraso</span>
              <strong>--</strong>
              <small>Devoluções pendentes</small>
            </article>
          </section>

          <section className="content-card">
            <div className="section-header">
              <div>
                <h2>Empréstimos recentes</h2>
                <p>Acompanhe as últimas movimentações.</p>
              </div>
              <button className="secondary-button">
                Ver todos
              </button>
            </div>

            <div className="empty-state">
              <div className="empty-icon">▤</div>
              <h3>Nenhum empréstimo exibido</h3>
              <p>Os empréstimos cadastrados aparecerão nesta tabela.</p>
            </div>
          </section>
        </main>
      </div>
  )
}

export default App
