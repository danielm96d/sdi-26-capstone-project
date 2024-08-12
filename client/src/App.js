import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';

function App() {
  return (
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
    </Routes>
    </>
  );
}

export default App;
