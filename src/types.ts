export type SportId =
  | 'baseball'
  | 'soccer'
  | 'volleyball'
  | 'basketball'
  | 'softball'
  | 'tennis'

export type Role = 'coach' | 'fan'

export type MatchStatus = 'open' | 'matched' | 'done'

export interface Sport {
  id: SportId
  label: string
  emoji: string
  color: string
}

export interface User {
  id: string
  name: string
  role: Role
  sport: SportId
  teamName: string
  area: string
  coins: number
  createdAt: string
}

export interface MatchRequest {
  id: string
  hostUserId: string
  hostTeamName: string
  sport: SportId
  date: string
  time: string
  place: string
  area: string
  note: string
  isPublic: boolean
  status: MatchStatus
  opponentUserId?: string
  opponentTeamName?: string
  cheerTotal: number
  createdAt: string
}

export interface Cheer {
  id: string
  matchId: string
  fromUserId: string
  fromName: string
  amount: number
  message: string
  createdAt: string
}

export interface AppState {
  currentUserId: string | null
  users: User[]
  matches: MatchRequest[]
  cheers: Cheer[]
}
