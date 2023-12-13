import InitialLogoTop from './InitialLogoTop';
import InitialLogoBottom from './InitialLogoBottom';
import SearchBar from './SearchBar';
import '../css/HomePage.css';

function HomePage() {
    return (
        <div className="HomePage">
        <InitialLogoTop />
        <SearchBar />
        <InitialLogoBottom />
        </div>
    );
};

export default HomePage;

