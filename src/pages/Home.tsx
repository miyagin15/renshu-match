import { Link } from 'react-router-dom'
import { MatchCard } from '../components/MatchCard'
import { useStore } from '../store'

export function Home() {
  const { currentUser, visibleMatches } = useStore()
  const publicOpen = visibleMatches.filter((m) => m.isPublic).slice(0, 4)

  return (
    <>
      <section className="hero">
        <p className="hero-brand">れんしゅマッチ</p>
        <h1>練習試合の相手、ここで見つかる。</h1>
        <p>
          電話や知り合いだけじゃなく、公開された募集から相手チームを探せます。ファンは試合を見て、投げ銭で応援もできます。
        </p>
        <div className="hero-actions">
          {currentUser ? (
            <>
              <Link to="/board" className="btn btn-primary">
                試合一覧を見る
              </Link>
              {currentUser.role === 'coach' && (
                <Link to="/create" className="btn btn-secondary">
                  試合を募集する
                </Link>
              )}
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                無料ではじめる
              </Link>
              <Link to="/board" className="btn btn-secondary">
                公開試合をのぞく
              </Link>
            </>
          )}
        </div>
      </section>

      <div className="demo-banner">
        <span>🎮 デモです。データはこの端末に保存されます。</span>
        <Link to="/register" style={{ color: 'var(--green-deep)', fontWeight: 800 }}>
          かんたんログイン →
        </Link>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>いま公開中の練習試合</h2>
            <p>だれでも見られる募集です</p>
          </div>
          <Link to="/board" style={{ color: 'var(--green)', fontWeight: 800 }}>
            すべて
          </Link>
        </div>
        {publicOpen.length === 0 ? (
          <div className="empty">まだ公開中の試合がありません</div>
        ) : (
          <div className="match-list">
            {publicOpen.map((m, i) => (
              <MatchCard key={m.id} match={m} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>できること</h2>
            <p>小中学生でもかんたん</p>
          </div>
        </div>
        <div className="match-list">
          <div className="match-card">
            <div style={{ fontSize: '1.8rem' }}>🤝</div>
            <h3 className="match-title">監督どうしで調整</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              日程・場所を出して、相手チームからの応募を受けられます。仲良し以外のチームともつながれます。
            </p>
          </div>
          <div className="match-card">
            <div style={{ fontSize: '1.8rem' }}>🔒</div>
            <h3 className="match-title">公開 / 非公開</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              広く募集したい試合は公開、仲良し限定は非公開。見せたい相手だけに絞れます。
            </p>
          </div>
          <div className="match-card">
            <div style={{ fontSize: '1.8rem' }}>🪙</div>
            <h3 className="match-title">ファンの投げ銭</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              サポーターは公開試合を見て、応援コインでメッセージ付きの応援が送れます（デモ）。
            </p>
          </div>
          <div className="match-card">
            <div style={{ fontSize: '1.8rem' }}>🏅</div>
            <h3 className="match-title">いろんなスポーツ</h3>
            <p style={{ margin: 0, color: 'var(--muted)' }}>
              野球・サッカー・バレー・バスケなど。登録時にスポーツを選びます。
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
