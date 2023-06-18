import Header from '../components/header.jsx';
import ProfileInfo from '../components/profile.jsx';
import Footer from '../components/footer.jsx';
import '../css/profile.scss';

const Profile = () => <>
    <Header title="Профіль користувача" />
    <main>
        <ProfileInfo />
    </main>
    <Footer />
</>;

export default Profile;
