import { useEffect, useState } from 'react';
import ForgotPassword from './Components/ForgotPassword.jsx';
import Welcome from './Components/welcome.jsx';

function App() {
  const [hash, setHash] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHashChange);

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return hash === '#forgot' ? <ForgotPassword /> : <Welcome />;
}

export default App;