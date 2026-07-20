import { HashRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Board } from './pages/Board'
import { CreateMatch } from './pages/CreateMatch'
import { Home } from './pages/Home'
import { MatchDetail } from './pages/MatchDetail'
import { MyPage } from './pages/MyPage'
import { Register } from './pages/Register'
import { StoreProvider } from './store'

export default function App() {
  return (
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="board" element={<Board />} />
            <Route path="matches/:id" element={<MatchDetail />} />
            <Route path="create" element={<CreateMatch />} />
            <Route path="mypage" element={<MyPage />} />
            <Route path="register" element={<Register />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  )
}
