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
        <h1>練習試合の調整を、知り合いづてから解放する。</h1>
        <p>
          監督・コーチ同士が公開募集で相手を見つけ、日程と会場をスムーズに決められます。サポーターは公開試合を見て、応援チップを送れます。
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
                アカウント作成
              </Link>
              <Link to="/board" className="btn btn-secondary">
                公開試合を見る
              </Link>
            </>
          )}
        </div>
      </section>

      <div className="demo-banner">
        <span>デモ版 — データはこの端末にのみ保存されます</span>
        <Link to="/register" style={{ color: 'var(--accent-deep)', fontWeight: 700 }}>
          デモログイン
        </Link>
      </div>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>公開中の練習試合</h2>
            <p>高校・大学・クラブの募集</p>
          </div>
          <Link to="/board" style={{ color: 'var(--accent)', fontWeight: 700 }}>
            すべて見る
          </Link>
        </div>
        {publicOpen.length === 0 ? (
          <div className="empty">公開中の試合はまだありません</div>
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
            <p>部活・サークル・クラブ向け</p>
          </div>
        </div>
        <div className="match-list">
          <div className="match-card">
            <div className="feature-label">Matchmaking</div>
            <h3 className="match-title">監督同士の日程調整</h3>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              日時・会場を出して応募を受け付け。既存のつながり以外のチームとも対戦相手を探せます。
            </p>
          </div>
          <div className="match-card">
            <div className="feature-label">Visibility</div>
            <h3 className="match-title">公開 / 非公開</h3>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              広く相手を募る場合は公開、既存チーム限定なら非公開。表示範囲を選べます。
            </p>
          </div>
          <div className="match-card">
            <div className="feature-label">Support</div>
            <h3 className="match-title">サポーターの応援チップ</h3>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              公開試合にメッセージ付きのチップを送れます。決済連携なしのデモ機能です。
            </p>
          </div>
          <div className="match-card">
            <div className="feature-label">Sports</div>
            <h3 className="match-title">複数競技対応</h3>
            <p style={{ margin: 0, color: 'var(--muted)', lineHeight: 1.6 }}>
              野球・サッカー・バレー・バスケなど。登録時に競技を選択します。
            </p>
          </div>
        </div>
      </section>
    </>
  )
}
