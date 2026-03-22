import { Route, Routes } from 'react-router-dom';
import Globe from './components/Globe';
import Home from './pages/Home';
import Preview from './pages/Preview';
import Landing from './pages/Landing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/preview" element={<Preview />} />
      <Route path="/home" element={<Home />} />
      <Route path="/globe" element={<Globe />} />
    </Routes>
  );
}

export default App;

