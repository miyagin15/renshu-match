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
        募集にはログインが必要です
        <div style={{ marginTop: 16 }}>
          <Link to="/register" className="btn btn-solid">
            ログイン
          </Link>
        </div>
      </div>
    )
  }

  if (currentUser.role !== 'coach') {
    return (
      <div className="empty">
        サポーターアカウントでは募集できません。試合一覧から応援チップを送れます。
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
      setError('会場を入力してください')
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
        {sport?.label} / {currentUser.teamName}
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
          <label htmlFor="place">会場</label>
          <input
            id="place"
            value={place}
            onChange={(e) => setPlace(e.target.value)}
            placeholder="例: 大学グラウンドA面"
            required
            maxLength={60}
          />
        </div>

        <div className="field">
          <label htmlFor="note">備考（任意）</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="対象カテゴリ、所要時間、雨天時の扱いなど"
            maxLength={200}
          />
        </div>

        <div className="toggle-row">
          <div>
            <strong>{isPublic ? '公開する' : '非公開にする'}</strong>
            <span>
              {isPublic
                ? '一覧に表示され、誰でも閲覧できます'
                : '主催者と対戦相手のみ表示されます'}
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

        {error && <p style={{ color: 'var(--danger)', fontWeight: 700, margin: 0 }}>{error}</p>}

        <button type="submit" className="btn btn-solid btn-block">
          募集を公開
        </button>
      </form>
    </>
  )
}
