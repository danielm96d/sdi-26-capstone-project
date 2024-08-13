import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './components/Login/Login';
import NavBar from './components/NavBar/NavBar';
import RequestModal from "./components/request.jsx"
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <>
    <NavBar/>
    <Routes>
      <Route path='/' element={<Login/>}/>
    </Routes>
      {/* <Profile /> */}
    </>
    </ChakraProvider>
  );
}

export default App;
