import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { AREAS, SPORTS, getSport } from '../data/sports'
import { useStore } from '../store'
import type { Role, SportId } from '../types'

export function Register() {
  const { register, loginAs, state, currentUser } = useStore()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [role, setRole] = useState<Role>('coach')
  const [sport, setSport] = useState<SportId>('baseball')
  const [teamName, setTeamName] = useState('')
  const [area, setArea] = useState(AREAS[0])

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    register({ name, role, sport, teamName, area })
    navigate(role === 'coach' ? '/create' : '/board')
  }

  return (
    <>
      <h1 className="page-title">はじめる</h1>
      <p className="page-sub">スポーツと役割を選んで、すぐ使えます</p>

      {currentUser && (
        <div className="demo-banner" style={{ marginBottom: 18 }}>
          いまは {currentUser.name}（{currentUser.role === 'coach' ? '監督' : 'ファン'}）でログイン中
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <h2>デモ用かんたんログイン</h2>
            <p>作らずにすぐ試せます</p>
          </div>
        </div>
        <div className="quick-login">
          {state.users.map((u) => {
            const s = getSport(u.sport)
            return (
              <button
                key={u.id}
                type="button"
                onClick={() => {
                  loginAs(u.id)
                  navigate('/board')
                }}
              >
                {s.emoji} {u.name}
                <small>
                  {u.role === 'coach' ? '監督' : 'ファン'} / {u.teamName} / {s.label}
                </small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>新しく登録</h2>
            <p>名前とスポーツを選ぶだけ</p>
          </div>
        </div>
        <form className="form-card form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label>あなたは？</label>
            <div className="role-grid">
              <button
                type="button"
                className={`choice ${role === 'coach' ? 'active' : ''}`}
                onClick={() => setRole('coach')}
              >
                <span className="big">🧢</span>
                監督・コーチ
              </button>
              <button
                type="button"
                className={`choice ${role === 'fan' ? 'active' : ''}`}
                onClick={() => setRole('fan')}
              >
                <span className="big">📣</span>
                ファン・応援
              </button>
            </div>
          </div>

          <div className="field">
            <label>スポーツ</label>
            <div className="sport-grid">
              {SPORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`choice ${sport === s.id ? 'active' : ''}`}
                  onClick={() => setSport(s.id)}
                >
                  <span className="big">{s.emoji}</span>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="name">ニックネーム</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: たろうコーチ"
              required
              maxLength={20}
            />
          </div>

          <div className="field">
            <label htmlFor="team">
              {role === 'coach' ? 'チーム名' : '推しチーム名（任意）'}
            </label>
            <input
              id="team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder={role === 'coach' ? '例: 青空スターズ' : '例: 青空スターズ'}
              maxLength={30}
            />
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

          <button type="submit" className="btn btn-solid btn-block">
            登録してはじめる
          </button>
        </form>
      </section>
    </>
  )
}
