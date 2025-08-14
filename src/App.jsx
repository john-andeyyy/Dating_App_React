import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import ProtectedRoutes from './ProtectedRoutes';
import Layout from './Layout';
import Home from './Pages/Home';
import Profile from './Pages/Profile';
import MatchList from './Pages/MatchList';
import Message from './Pages/Message';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path='/Home' element={<Home />} />
          <Route path='/Profile' element={<Profile />} />
          <Route path='/MatchList' element={<MatchList />} />
          <Route path='/Message' element={<Message />} />
        </Route>
      </Route>

    </Routes>
  );
}

export default App;
