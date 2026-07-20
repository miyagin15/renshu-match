import { Link } from 'react-router-dom'
import { getSport } from '../data/sports'
import type { MatchRequest } from '../types'

const STATUS_LABEL: Record<string, string> = {
  open: '募集中',
  matched: '対戦決定',
  done: '終了',
}

function formatDate(date: string) {
  const d = new Date(`${date}T00:00:00`)
  const week = ['日', '月', '火', '水', '木', '金', '土'][d.getDay()]
  return `${d.getMonth() + 1}/${d.getDate()}（${week}）`
}

export function MatchCard({ match, index = 0 }: { match: MatchRequest; index?: number }) {
  const sport = getSport(match.sport)

  return (
    <Link
      to={`/matches/${match.id}`}
      className="match-card"
      style={{ animationDelay: `${Math.min(index, 8) * 0.04}s` }}
    >
      <div className="match-card-top">
        <span className="sport-badge" style={{ background: sport.color }}>
          {sport.label}
        </span>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {!match.isPublic && <span className="status-tag private">非公開</span>}
          <span className={`status-tag ${match.status}`}>{STATUS_LABEL[match.status]}</span>
        </div>
      </div>

      <h3 className="match-title">{match.hostTeamName}</h3>

      <div className="match-meta">
        <div>
          <strong>{formatDate(match.date)}</strong> {match.time}〜
        </div>
        <div>
          {match.area} / {match.place}
        </div>
      </div>

      <div className="match-foot">
        <span className="cheer-count">Tip {match.cheerTotal.toLocaleString()}</span>
        <span style={{ color: 'var(--accent)', fontWeight: 700, fontSize: '0.86rem' }}>詳細</span>
      </div>
    </Link>
  )
}
