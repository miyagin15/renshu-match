import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useStore } from '../store'

export function Layout() {
  const { currentUser } = useStore()
  const navigate = useNavigate()

  return (
    <div className="app-shell">
      <header className="topbar">
        <button
          type="button"
          className="brand"
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
        >
          <span className="brand-mark" aria-hidden>
            ◎
          </span>
          <span>れんしゅマッチ</span>
        </button>
        {currentUser ? (
          <div className="coin-pill" title="応援コイン">
            🪙 {currentUser.coins.toLocaleString()}
          </div>
        ) : (
          <button type="button" className="btn btn-ghost" style={{ padding: '8px 14px' }} onClick={() => navigate('/register')}>
            はじめる
          </button>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="nav-dock" aria-label="メインメニュー">
        <NavLink to="/" end>
          <span className="nav-ico">🏠</span>
          ホーム
        </NavLink>
        <NavLink to="/board">
          <span className="nav-ico">📋</span>
          試合一覧
        </NavLink>
        <NavLink to="/create">
          <span className="nav-ico">➕</span>
          募集
        </NavLink>
        <NavLink to="/mypage">
          <span className="nav-ico">👤</span>
          マイページ
        </NavLink>
      </nav>
    </div>
  )
}
