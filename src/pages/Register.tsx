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
      <h1 className="page-title">ログイン / 登録</h1>
      <p className="page-sub">役割と競技を選んで利用を開始できます</p>

      {currentUser && (
        <div className="demo-banner" style={{ marginBottom: 18 }}>
          現在: {currentUser.name}（{currentUser.role === 'coach' ? '監督・コーチ' : 'サポーター'}）
        </div>
      )}

      <section className="section">
        <div className="section-head">
          <div>
            <h2>デモアカウント</h2>
            <p>登録なしですぐに操作を確認できます</p>
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
                {u.name}
                <small>
                  {u.role === 'coach' ? '監督・コーチ' : 'サポーター'} / {u.teamName} / {s.label}
                </small>
              </button>
            )
          })}
        </div>
      </section>

      <section className="section">
        <div className="section-head">
          <div>
            <h2>新規登録</h2>
            <p>表示名と競技を設定</p>
          </div>
        </div>
        <form className="form-card form-grid" onSubmit={onSubmit}>
          <div className="field">
            <label>役割</label>
            <div className="role-grid">
              <button
                type="button"
                className={`choice ${role === 'coach' ? 'active' : ''}`}
                onClick={() => setRole('coach')}
              >
                <span className="big">Coach</span>
                監督・コーチ
              </button>
              <button
                type="button"
                className={`choice ${role === 'fan' ? 'active' : ''}`}
                onClick={() => setRole('fan')}
              >
                <span className="big">Fan</span>
                サポーター
              </button>
            </div>
          </div>

          <div className="field">
            <label>競技</label>
            <div className="sport-grid">
              {SPORTS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`choice ${sport === s.id ? 'active' : ''}`}
                  onClick={() => setSport(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="field">
            <label htmlFor="name">表示名</label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例: 田中 翔"
              required
              maxLength={20}
            />
          </div>

          <div className="field">
            <label htmlFor="team">
              {role === 'coach' ? 'チーム名' : '応援チーム（任意）'}
            </label>
            <input
              id="team"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder={
                role === 'coach' ? '例: ○○高校 硬式野球部' : '例: ○○高校 硬式野球部'
              }
              maxLength={40}
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
            登録して開始
          </button>
        </form>
      </section>
    </>
  )
}
