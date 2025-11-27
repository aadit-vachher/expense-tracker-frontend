
import {Routes,Route} from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Favourites from './pages/Favourites'


function App(){
  return(
    <Routes>
      <Route path="/login" element={<Login/>}/>
      <Route path="/signup" element={<Signup/>}/>
       <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="*" element={<Login/>}/>
      <Route path="/favourites" element={<Favourites />} />
    </Routes>
  )
}

export default App



