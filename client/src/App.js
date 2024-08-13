import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import RequestModal from "./components/request.jsx"
<<<<<<< HEAD
=======
import Profile from './components/Profile.jsx'
import Calender from './components/Calender.js'
import { ChakraProvider } from '@chakra-ui/react'
<<<<<<< HEAD
import Profile from "./components/Profile.jsx"
=======
>>>>>>> d30c6b5424ea2a962c19d5e753add5280c8c68f5
import Register from './components/Register/Register.js';
>>>>>>> 25d87690114a9c542ed3f41af9cab6f53bc6be37

function App() {
  return (
    <>
<<<<<<< HEAD
      <NavBar />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/sign-up' element={<Register />} />
      </Routes>
=======
    <NavBar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
<<<<<<< HEAD
      <Route path='/profile' element={<Profile />}/>
=======
      <Route path='/sign-up' element={<Register/>}/>
<<<<<<< HEAD
      <Route path='/calender' element={<Calender/>}/>
      <Route path='/profile' element={<Profile/>}/>
=======
>>>>>>> 25d87690114a9c542ed3f41af9cab6f53bc6be37
>>>>>>> bd2d893977fdf0a3b4e024ddaa35adb165d2f5f1
    </Routes>
>>>>>>> d30c6b5424ea2a962c19d5e753add5280c8c68f5
      {/* <Profile /> */}
    </>
  );
}

export default App;
