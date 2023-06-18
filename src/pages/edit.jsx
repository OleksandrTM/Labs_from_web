import Header from '../components/header.jsx';
import EditProfile from '../components/edit.jsx';
import Footer from '../components/footer.jsx';
import '../css/edit.scss';

const Edit = () => <>
    <Header title="Редагування профілю користувача" />
    <main>
        <EditProfile />
    </main>
    <Footer />
</>;

export default Edit;
