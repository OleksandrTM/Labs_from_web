import Header from '../components/header.jsx';
import UserTable from '../components/user_table.jsx';
import AddStudentForm from '../components/add_student.jsx';
import StudentRatingTable from '../components/lr_rating_table.jsx';
import About from '../components/about.jsx';
import Footer from '../components/footer.jsx';
import '../css/style.scss';

const Mainlr = () => <>
    <Header title="Студентський рейтинг" />
    <main>
        {localStorage.userRole === 'admin' ? <UserTable /> : <></>}
        {localStorage.userRole === 'manager' ? <AddStudentForm /> : <></>}
        <StudentRatingTable />
        <About />
    </main>
    <Footer />
</>;

export default Mainlr;
