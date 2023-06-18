import {
    BrowserRouter, Routes, Route,
} from 'react-router-dom';
import Main from './pages/main.jsx';
import Login from './pages/login.jsx';
import Registration from './pages/registration.jsx';
import Mainlr from './pages/main_lr.jsx';
import Profile from './pages/profile.jsx';
import Edit from './pages/edit.jsx';
import Student from './pages/student.jsx';
import StudentEdit from './pages/edit_student.jsx';
import PrivateRoute from './components/private_route.jsx';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />}></Route>
                <Route path="/registration" element={<Registration />}></Route>
                <Route path="/login" element={<Login />}></Route>
                <Route path="/general" element={<PrivateRoute><Mainlr /></PrivateRoute>}></Route>
                <Route path="/general/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>}></Route>
                <Route path="/general/profile/edit/:id" element={<PrivateRoute><Edit /></PrivateRoute>}></Route>
                <Route path="/general/student/:id" element={<PrivateRoute><Student /></PrivateRoute>}></Route>
                <Route path="/general/student/edit/:id" element={<PrivateRoute><StudentEdit /></PrivateRoute>}></Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
