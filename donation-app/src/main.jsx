import {BrowserRouter, Route, Routes} from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Organisation from './pages/Organisation.jsx'
import { ViewChildren } from './pages/ViewChildren.jsx'
import Donate from './Pages/Donate.jsx'


createRoot(document.getElementById('root')).render(

  <BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/home" element={<App />} />
    <Route path="/donate" element={<Donate />} />
    <Route path="/viewchildren" element={<ViewChildren />} />
    <Route path="/organisation" element={<Organisation />} />
  </Routes>
</BrowserRouter>
)
