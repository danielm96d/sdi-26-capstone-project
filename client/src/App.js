import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import RequestModal from "./components/request.jsx"
import Register from './components/Register/Register.js';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/sign-up' element={<Register />} />
      </Routes>
      {/* <Profile /> */}
    </>
  );
}

export default App;
