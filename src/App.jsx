import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import LoginPages from "./pages/LoginPages"
import HomePage from './pages/HomePage'
import Layout from './components/Layout'
import DetailNotePage from './pages/DetailNotePage'
import { Toaster } from 'react-hot-toast'
import { GlobalContextProvider } from './context/globalContext'

function App() {

  return (
    <>
      <Router>
        <Toaster position="top-center" /> 
        <Routes>
        <Route path="/" element={<LoginPages />} />

        <Route
          element={
            <GlobalContextProvider>
              <Layout />
            </GlobalContextProvider>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/detail-note" element={<DetailNotePage />} />
        </Route>

        {/* <Route path="/*" element={<NotFound />} /> */}
      </Routes>
      </Router> 
    </>
  )
}

export default App
