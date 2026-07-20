import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CheerModal } from '../components/CheerModal'
import { getSport } from '../data/sports'
import { useStore } from '../store'

const STATUS_LABEL = {
  open: '相手募集中',
  matched: '対戦決定',
  done: '終了',
} as const

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`)
  const week = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}（${week}）`
}

export function MatchDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { state, currentUser, applyToMatch, setMatchStatus, cheersFor } = useStore()
  const [cheerOpen, setCheerOpen] = useState(false)
  const [toast, setToast] = useState('')

  const match = state.matches.find((m) => m.id === id)
  if (!match) {
    return (
      <div className="empty">
        試合が見つかりません
        <div style={{ marginTop: 14 }}>
          <Link to="/board" className="btn btn-solid">
            一覧へ戻る
          </Link>
        </div>
      </div>
    )
  }

  const sport = getSport(match.sport)
  const cheers = cheersFor(match.id)
  const isHost = currentUser?.id === match.hostUserId
  const canApply =
    !!currentUser &&
    currentUser.role === 'coach' &&
    currentUser.sport === match.sport &&
    match.status === 'open' &&
    !isHost
  const canCheer = !!currentUser && match.isPublic

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2200)
  }

  return (
    <>
      {toast && <div className="toast">{toast}</div>}

      <button
        type="button"
        className="btn btn-ghost"
        style={{ padding: '8px 14px', marginBottom: 12 }}
        onClick={() => navigate(-1)}
      >
        ← 戻る
      </button>

      <article className="detail-hero">
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <span className="sport-badge" style={{ background: sport.color }}>
            {sport.emoji} {sport.label}
          </span>
          {!match.isPublic && <span className="status-tag private">非公開</span>}
          <span className={`status-tag ${match.status}`}>{STATUS_LABEL[match.status]}</span>
        </div>

        <h1>{match.hostTeamName} の練習試合</h1>

        <div className="vs">
          <div className="team">
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>主催</div>
            <div>{match.hostTeamName}</div>
          </div>
          <div className="mark">VS</div>
          <div className="team">
            <div style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>相手</div>
            <div>{match.opponentTeamName ?? '募集中…'}</div>
          </div>
        </div>

        <div className="match-meta" style={{ marginBottom: 16 }}>
          <div>
            📅 <strong>{formatDate(match.date)}</strong> {match.time}〜
          </div>
          <div>
            📍 <strong>{match.area}</strong> / {match.place}
          </div>
          {match.note && (
            <div style={{ marginTop: 8, lineHeight: 1.55 }}>
              💬 {match.note}
            </div>
          )}
        </div>

        <div className="cheer-count" style={{ marginBottom: 16, fontSize: '1.05rem' }}>
          🪙 応援合計 {match.cheerTotal.toLocaleString()} コイン
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {canApply && (
            <button
              type="button"
              className="btn btn-solid"
              onClick={() => {
                const ok = applyToMatch(match.id)
                flash(ok ? '応募しました！対戦が決まりました' : '応募できませんでした')
              }}
            >
              この試合に応募する
            </button>
          )}
          {canCheer && (
            <button type="button" className="btn btn-coral" onClick={() => setCheerOpen(true)}>
              🪙 投げ銭で応援
            </button>
          )}
          {!currentUser && (
            <Link to="/register" className="btn btn-primary">
              ログインして参加・応援
            </Link>
          )}
          {isHost && match.status === 'matched' && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setMatchStatus(match.id, 'done')
                flash('試合を終了にしました')
              }}
            >
              試合終了にする
            </button>
          )}
        </div>

        {currentUser?.role === 'coach' &&
          currentUser.sport !== match.sport &&
          !isHost &&
          match.status === 'open' && (
            <p style={{ marginBottom: 0, marginTop: 14, color: 'var(--muted)', fontWeight: 700 }}>
              ※ 同じスポーツの監督だけ応募できます（あなたのスポーツ: {getSport(currentUser.sport).label}）
            </p>
          )}
      </article>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>応援メッセージ</h2>
            <p>ファンからの投げ銭</p>
          </div>
        </div>
        {cheers.length === 0 ? (
          <div className="empty">まだ応援はありません。最初の1人になろう！</div>
        ) : (
          <div className="cheer-list">
            {cheers.map((c) => (
              <div key={c.id} className="cheer-item">
                <div className="avatar">{c.fromName.slice(0, 1)}</div>
                <div>
                  <strong>{c.fromName}</strong>
                  <p className="msg">{c.message}</p>
                </div>
                <div className="amount">🪙 {c.amount}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {cheerOpen && (
        <CheerModal
          matchId={match.id}
          teamName={match.hostTeamName}
          onClose={() => setCheerOpen(false)}
        />
      )}
    </>
  )
}
