import logo from './logo.svg';
import './App.css';
import RequestModal from "./components/request.jsx"
import { ChakraProvider } from '@chakra-ui/react'

function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <h1>hello world</h1>
      <RequestModal/>
    </div>
    </ChakraProvider>
  );
}

export default App;
