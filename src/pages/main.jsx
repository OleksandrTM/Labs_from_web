import About from '../components/about.jsx';
import Footer from '../components/footer.jsx';
import Header from '../components/header.jsx';
import RatingTable from '../components/rating_table.jsx';
import '../css/style.scss';

const Main = () => <>
    <Header title="Студентський рейтинг" />
    <main>
        <RatingTable />
        <About />
    </main>
    <Footer />
</>;

export default Main;
