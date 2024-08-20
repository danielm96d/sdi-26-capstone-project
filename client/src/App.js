import { Route, Routes } from 'react-router-dom';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import Profile from './components/Profile.jsx'
import Calendar from './components/Calendar.js'
import Register from './components/Register/Register.js';
import Scheduler from './components/Scheduler.js'
import NotFound from './components/NotFound/NotFound.js';
import EventEntry from './components/EventEntry.js'
import EventsDetailsPage from './components/EventDetails';
import ApprovalPage from './components/ApprovalPage.js';


function App() {
      return (
            <>
                  <NavBar />
                  <Routes>
                        <Route path='/' element={<Profile />} />
                        <Route path="/login" element={<Login/>}/>
                        <Route path='/profile' element={<Profile />} />
                        <Route path='/sign-up' element={<Register />} />
                        <Route path='/calendar' element={<Calendar />} />
                        <Route path='/scheduler/:id' element={<Scheduler />} />
                        <Route path='/event-entry' element={<EventEntry />} />
                        <Route path='/event-details/:id' element={<EventsDetailsPage />} />
                        <Route path='/approval' element={<ApprovalPage />} />
                        <Route path='*' element={<NotFound/>}/>
                  </Routes>

            </>
      );
}

export default App;
