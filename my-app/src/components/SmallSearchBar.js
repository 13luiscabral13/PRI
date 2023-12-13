import SearchBar from './SearchBar';
import InitialLogoTop from './InitialLogoTop';
import '../css/SmallSearchBar.css';
const SmallSearchBar = () => {
    return (
        <div className='small-search-bar'>
        <a href="/">
        <InitialLogoTop />
        </a>
        <SearchBar />
        </div>
    );
};

export default SmallSearchBar;