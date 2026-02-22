import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import UserListPage from './pages/UserListPage';
import UserFormPage from './pages/UserFormPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Navigate to='/login' />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/users' element={<UserListPage />} />
        <Route path='/users/add' element={<UserFormPage />} />
        <Route path='/users/edit/:id' element={<UserFormPage />} />
      </Routes>
    </BrowserRouter>
  );
}