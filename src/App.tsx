import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Globe from '@components/Globe';
import Home from '@pages/home';
import Landing from '@pages/landing';
import SignIn from '@pages/signIn';
import SignUp from '@pages/signUp';
import Settings from '@pages/settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />  
      <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/globe" element={<ProtectedRoute><Globe /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;

