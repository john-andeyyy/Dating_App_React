import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './Pages/AuthForm';
import ProtectedRoutes from './ProtectedRoutes';
import Layout from './Layout';
import Home from './Pages/Home';
import Profile from './Pages/Profile';

function App() {
  return (
      <Routes>
        <Route path="/" element={<AuthForm />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<Layout />}>
          <Route path='/Home' element={<Home />} />
          <Route path='/Profile' element={<Profile/>} />
          {/* <Route path='/ProductLists' element={<ProductLists />} /> */}
          {/* <Route path='/Dashboard' element={<Dashboard />} /> */}
          {/* <Route path='/Sample' element={<Sample />} /> */}
        </Route>
      </Route>


      </Routes>
  );
}

export default App;
