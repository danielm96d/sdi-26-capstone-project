import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import RequestModal from "./components/request.jsx"
import { ChakraProvider } from '@chakra-ui/react'
<<<<<<< HEAD
import Profile from "./components/Profile.jsx"
=======
import Register from './components/Register/Register.js';
>>>>>>> 25d87690114a9c542ed3f41af9cab6f53bc6be37

function App() {
  return (
    <ChakraProvider>
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
<<<<<<< HEAD
      <Route path='/profile' element={<Profile />}/>
=======
      <Route path='/sign-up' element={<Register/>}/>
>>>>>>> 25d87690114a9c542ed3f41af9cab6f53bc6be37
    </Routes>
      {/* <Profile /> */}
    </>
    </ChakraProvider>
  );
}

export default App;
