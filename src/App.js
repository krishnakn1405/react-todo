import { useEffect, useState } from 'react';
import './App.css';
import NavBar from './components/NavBar/NavBar';
import Todos from './components/Todos/Todos';
import LogPopup from './components/LogPopup/LogPopup';

function App() {

  const [token, setToken] = useState();

  useEffect(() => {

    const hash = window.location.hash;

    const params = new URLSearchParams(hash.substring(1));
    const token = params.get('access_token');

    if (token != null) {
      localStorage.setItem('todo-auth-token', token);
    }

    setToken(localStorage.getItem('todo-auth-token'));
  }, [])

  // eslint-disable-next-line
  if (token != undefined) {

    return (
      <div className="App">
        <NavBar />
        <Todos />
      </div>
    );
  } else {
    return (
      <div className="App">
        <LogPopup />
      </div>
    );
  }
}

export default App;
