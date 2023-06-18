import Header from '../components/header.jsx';
import StudentEditForm from '../components/student_edit.jsx';
import Footer from '../components/footer.jsx';
import '../css/student_edit.scss';

const StudentEdit = () => <>
    <Header title='Редагування даних студента' />
    <StudentEditForm />
    <Footer />
</>;

export default StudentEdit;
