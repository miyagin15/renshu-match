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
            +
          </span>
          <span>れんしゅマッチ</span>
        </button>
        {currentUser ? (
          <div className="coin-pill" title="応援チップ残高">
            Tip {currentUser.coins.toLocaleString()}
          </div>
        ) : (
          <button
            type="button"
            className="btn btn-ghost"
            style={{ padding: '8px 14px' }}
            onClick={() => navigate('/register')}
          >
            ログイン
          </button>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <nav className="nav-dock" aria-label="メインメニュー">
        <NavLink to="/" end>
          <span className="nav-ico">Home</span>
          ホーム
        </NavLink>
        <NavLink to="/board">
          <span className="nav-ico">List</span>
          試合
        </NavLink>
        <NavLink to="/create">
          <span className="nav-ico">Post</span>
          募集
        </NavLink>
        <NavLink to="/mypage">
          <span className="nav-ico">Me</span>
          マイ
        </NavLink>
      </nav>
    </div>
  )
}
