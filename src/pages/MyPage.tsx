import { Link } from 'react-router-dom'
import { MatchCard } from '../components/MatchCard'
import { getSport } from '../data/sports'
import { useStore } from '../store'

export function MyPage() {
  const { currentUser, myMatches, logout, addCoins, resetDemo } = useStore()

  if (!currentUser) {
    return (
      <div className="empty">
        ログインしていません
        <div style={{ marginTop: 16, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/register" className="btn btn-solid">
            ログイン
          </Link>
          <Link to="/board" className="btn btn-ghost">
            公開試合を見る
          </Link>
        </div>
      </div>
    )
  }

  const sport = getSport(currentUser.sport)
  const openCount = myMatches.filter((m) => m.status === 'open').length
  const matchedCount = myMatches.filter((m) => m.status === 'matched').length

  return (
    <>
      <h1 className="page-title">{currentUser.name}</h1>
      <p className="page-sub">
        {sport.label} / {currentUser.role === 'coach' ? '監督・コーチ' : 'サポーター'} /{' '}
        {currentUser.teamName}（{currentUser.area}）
      </p>

      <div className="stat-row">
        <div className="stat">
          <div className="n">{currentUser.coins.toLocaleString()}</div>
          <div className="l">Tip残高</div>
        </div>
        <div className="stat">
          <div className="n">{openCount}</div>
          <div className="l">募集中</div>
        </div>
        <div className="stat">
          <div className="n">{matchedCount}</div>
          <div className="l">対戦決定</div>
        </div>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 22 }}>
        <button type="button" className="btn btn-primary" onClick={() => addCoins(1000)}>
          +1000 デモチャージ
        </button>
        {currentUser.role === 'coach' && (
          <Link to="/create" className="btn btn-solid">
            新しい募集
          </Link>
        )}
        <button type="button" className="btn btn-ghost" onClick={logout}>
          ログアウト
        </button>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>自分の試合</h2>
            <p>主催・参加した試合</p>
          </div>
        </div>
        {myMatches.length === 0 ? (
          <div className="empty">まだ試合がありません</div>
        ) : (
          <div className="match-list">
            {myMatches.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>デモ操作</h2>
            <p>初期データに戻す</p>
          </div>
        </div>
        <button
          type="button"
          className="btn btn-ghost btn-block"
          onClick={() => {
            if (confirm('デモデータを初期状態に戻しますか？')) resetDemo()
          }}
        >
          データをリセット
        </button>
      </section>
    </>
  )
}
