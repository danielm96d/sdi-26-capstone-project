import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import Register from './components/Register/Register';

function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/sign-up' element={<Register/>}/>
    </Routes>
    </>
  );
}

export default App;
