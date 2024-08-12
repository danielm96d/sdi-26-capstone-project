import logo from './logo.svg';
import './App.css';
import Profile from "./components/Profile.jsx"
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <h1>hello world</h1>
      <Profile />
    </div>
    </ChakraProvider>
  );
}

export default App;
