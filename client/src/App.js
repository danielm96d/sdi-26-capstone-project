import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import RequestModal from "./components/request.jsx"
import Profile from './components/Profile.jsx'
import { ChakraProvider } from '@chakra-ui/react'
import Register from './components/Register/Register.js';

function App() {
  return (
    <ChakraProvider>
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/sign-up' element={<Register/>}/>
      <Route path='/calender' element={<Calender/>}/>
      <Route path='/profile' element={<Profile/>}/>
    </Routes>
      {/* <Profile /> */}
    </>
    </ChakraProvider>
  );
}

export default App;
