import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import Profile from './components/Profile.jsx'
import Calender from './components/Calender.js'
import Register from './components/Register/Register.js';
import Scheduler from './components/Scheduler.js'

function App() {
      return (
            <>
                  <NavBar />
                  <Routes>
                        <Route path='/' element={<Login />} />
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/sign-up' element={<Register />} />
                        <Route path='/calender' element={<Calender />} />
                        <Route path='/scheduler/:id' element={<Scheduler />} />
                  </Routes>

            </>
      );
}

export default App;
