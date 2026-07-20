import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { SEED } from './data/seed'
import type {
  AppState,
  Cheer,
  MatchRequest,
  MatchStatus,
  Role,
  SportId,
  User,
} from './types'

const STORAGE_KEY = 'renshu-match-v1'

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AppState
  } catch {
    /* ignore */
  }
  return structuredClone(SEED)
}

function uid(prefix: string) {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`
}

interface StoreApi {
  state: AppState
  currentUser: User | null
  register: (input: {
    name: string
    role: Role
    sport: SportId
    teamName: string
    area: string
  }) => User
  loginAs: (userId: string) => void
  logout: () => void
  createMatch: (input: {
    date: string
    time: string
    place: string
    area: string
    note: string
    isPublic: boolean
  }) => MatchRequest | null
  applyToMatch: (matchId: string) => boolean
  setMatchStatus: (matchId: string, status: MatchStatus) => void
  sendCheer: (matchId: string, amount: number, message: string) => boolean
  addCoins: (amount: number) => void
  resetDemo: () => void
  visibleMatches: MatchRequest[]
  myMatches: MatchRequest[]
  cheersFor: (matchId: string) => Cheer[]
}

const StoreContext = createContext<StoreApi | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  }, [state])

  const currentUser = useMemo(
    () => state.users.find((u) => u.id === state.currentUserId) ?? null,
    [state.users, state.currentUserId],
  )

  const register = useCallback(
    (input: {
      name: string
      role: Role
      sport: SportId
      teamName: string
      area: string
    }) => {
      const user: User = {
        id: uid('u'),
        name: input.name.trim(),
        role: input.role,
        sport: input.sport,
        teamName: input.teamName.trim() || (input.role === 'fan' ? 'ファン' : '無名チーム'),
        area: input.area,
        coins: input.role === 'fan' ? 2500 : 1000,
        createdAt: new Date().toISOString(),
      }
      setState((s) => ({
        ...s,
        users: [...s.users, user],
        currentUserId: user.id,
      }))
      return user
    },
    [],
  )

  const loginAs = useCallback((userId: string) => {
    setState((s) => ({ ...s, currentUserId: userId }))
  }, [])

  const logout = useCallback(() => {
    setState((s) => ({ ...s, currentUserId: null }))
  }, [])

  const createMatch = useCallback(
    (input: {
      date: string
      time: string
      place: string
      area: string
      note: string
      isPublic: boolean
    }) => {
      if (!currentUser || currentUser.role !== 'coach') return null
      const match: MatchRequest = {
        id: uid('m'),
        hostUserId: currentUser.id,
        hostTeamName: currentUser.teamName,
        sport: currentUser.sport,
        date: input.date,
        time: input.time,
        place: input.place.trim(),
        area: input.area,
        note: input.note.trim(),
        isPublic: input.isPublic,
        status: 'open',
        cheerTotal: 0,
        createdAt: new Date().toISOString(),
      }
      setState((s) => ({ ...s, matches: [match, ...s.matches] }))
      return match
    },
    [currentUser],
  )

  const applyToMatch = useCallback(
    (matchId: string) => {
      if (!currentUser || currentUser.role !== 'coach') return false
      let ok = false
      setState((s) => {
        const matches = s.matches.map((m) => {
          if (
            m.id !== matchId ||
            m.status !== 'open' ||
            m.hostUserId === currentUser.id ||
            m.sport !== currentUser.sport
          ) {
            return m
          }
          ok = true
          return {
            ...m,
            status: 'matched' as const,
            opponentUserId: currentUser.id,
            opponentTeamName: currentUser.teamName,
          }
        })
        return { ...s, matches }
      })
      return ok
    },
    [currentUser],
  )

  const setMatchStatus = useCallback((matchId: string, status: MatchStatus) => {
    setState((s) => ({
      ...s,
      matches: s.matches.map((m) => (m.id === matchId ? { ...m, status } : m)),
    }))
  }, [])

  const sendCheer = useCallback(
    (matchId: string, amount: number, message: string) => {
      if (!currentUser || currentUser.coins < amount) return false
      const cheer: Cheer = {
        id: uid('c'),
        matchId,
        fromUserId: currentUser.id,
        fromName: currentUser.name,
        amount,
        message: message.trim() || 'がんばれ！',
        createdAt: new Date().toISOString(),
      }
      setState((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === currentUser.id ? { ...u, coins: u.coins - amount } : u,
        ),
        matches: s.matches.map((m) =>
          m.id === matchId ? { ...m, cheerTotal: m.cheerTotal + amount } : m,
        ),
        cheers: [cheer, ...s.cheers],
      }))
      return true
    },
    [currentUser],
  )

  const addCoins = useCallback(
    (amount: number) => {
      if (!currentUser) return
      setState((s) => ({
        ...s,
        users: s.users.map((u) =>
          u.id === currentUser.id ? { ...u, coins: u.coins + amount } : u,
        ),
      }))
    },
    [currentUser],
  )

  const resetDemo = useCallback(() => {
    const fresh = structuredClone(SEED)
    setState(fresh)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh))
  }, [])

  const visibleMatches = useMemo(() => {
    return state.matches
      .filter((m) => {
        if (m.isPublic) return true
        if (!currentUser) return false
        return (
          m.hostUserId === currentUser.id ||
          m.opponentUserId === currentUser.id
        )
      })
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [state.matches, currentUser])

  const myMatches = useMemo(() => {
    if (!currentUser) return []
    return state.matches.filter(
      (m) =>
        m.hostUserId === currentUser.id ||
        m.opponentUserId === currentUser.id,
    )
  }, [state.matches, currentUser])

  const cheersFor = useCallback(
    (matchId: string) => state.cheers.filter((c) => c.matchId === matchId),
    [state.cheers],
  )

  const api: StoreApi = {
    state,
    currentUser,
    register,
    loginAs,
    logout,
    createMatch,
    applyToMatch,
    setMatchStatus,
    sendCheer,
    addCoins,
    resetDemo,
    visibleMatches,
    myMatches,
    cheersFor,
  }

  return <StoreContext.Provider value={api}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
