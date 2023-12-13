import WikipediaImage from '../images/Wikipedia.png';
import MetacriticImage from '../images/Metacritic.png';
import '../css/TabsWikimeta.css';

const TabsWikimeta = ({ selectedInfo, onSelect }) => {
  return (
    <div className="tabs-info">
        <button
          key='Wikipedia'
          onClick={() => onSelect('Wikipedia')}
          className={`tab-button ${selectedInfo === 'Wikipedia' ? 'active' : ''}`}
        >
          <img src={WikipediaImage} alt="Wikipedia" />
        </button>

        <button
          key='Metacritic'
          onClick={() => onSelect('Metacritic')}
          className={`tab-button ${selectedInfo === 'Metacritic' ? 'active' : ''}`}
        >
          <img src={MetacriticImage} alt="Metacritic" />
        </button>
    </div>
  );
};

export default TabsWikimeta;