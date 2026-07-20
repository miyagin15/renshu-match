import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AREAS, getSport } from '../data/sports'
import { useStore } from '../store'

function defaultDate() {
  const d = new Date()
  d.setDate(d.getDate() + 7)
  return d.toISOString().slice(0, 10)
}

export function CreateMatch() {
  const { currentUser, createMatch } = useStore()
  const navigate = useNavigate()
  const [date, setDate] = useState(defaultDate)
  const [time, setTime] = useState('10:00')
  const [place, setPlace] = useState('')
  const [area, setArea] = useState(currentUser?.area ?? AREAS[0])
  const [note, setNote] = useState('')
  const [isPublic, setIsPublic] = useState(true)
  const [error, setError] = useState('')

  const sport = useMemo(
    () => (currentUser ? getSport(currentUser.sport) : null),
    [currentUser],
  )

  if (!currentUser) {
    return (
      <div className="empty">
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>🧢</div>
        試合を募集するにはログインが必要です
        <div style={{ marginTop: 16 }}>
          <Link to="/register" className="btn btn-solid">
            はじめる
          </Link>
        </div>
      </div>
    )
  }

  if (currentUser.role !== 'coach') {
    return (
      <div className="empty">
        <div style={{ fontSize: '2rem', marginBottom: 8 }}>📣</div>
        ファンアカウントでは募集できません。試合を見て投げ銭で応援しよう！
        <div style={{ marginTop: 16 }}>
          <Link to="/board" className="btn btn-solid">
            試合一覧へ
          </Link>
        </div>
      </div>
    )
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    if (!place.trim()) {
      setError('場所を入れてください')
      return
    }
    const match = createMatch({ date, time, place, area, note, isPublic })
    if (!match) {
      setError('作成に失敗しました')
      return
    }
    navigate(`/matches/${match.id}`)
  }

  return (
    <>
      <h1 className="page-title">試合を募集</h1>
      <p className="page-sub">
        {sport?.emoji} {sport?.label} / {currentUser.teamName}
      </p>

      <form className="form-card form-grid" onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="date">日付</label>
          <input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="time">開始時間</label>
          <input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} required />
        </div>

        <div className="field">
          <label htmlFor="area">エリア</label>
          <select id="area" value={area} onChange={(e) => setArea(e.target.value)}>
            {AREAS.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="place">場所</label>
          <input
            id="place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="例: ○○中央グラウンド"
            required
            maxLength={60}
          />
        </div>

        <div className="field">
          <label htmlFor="note">ひとこと（任意）</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="学年・雨天時・持ち物など"
            maxLength={200}
          />
        </div>

        <div className="toggle-row">
          <div>
            <strong>{isPublic ? '🌍 公開する' : '🔒 非公開にする'}</strong>
            <span>
              {isPublic
                ? 'だれでも一覧で見られます'
                : 'あなた（と対戦相手）だけが見られます'}
            </span>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        {error && <p style={{ color: 'var(--coral)', fontWeight: 700, margin: 0 }}>{error}</p>}

        <button type="submit" className="btn btn-solid btn-block">
          募集を出す
        </button>
      </form>
    </>
  )
}
