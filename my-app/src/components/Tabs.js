// Tabs.js
import React from 'react';
import '../css/Tabs.css';
import pcImage from '../images/PC.png';
import ps3Image from '../images/PlayStation3.png';
import ps4Image from '../images/PlayStation4.png';
import xboxOneImage from '../images/XboxOne.png';
import xboxImage from '../images/Xbox.png';
import xbox360Image from '../images/Xbox360.png';
import switchImage from '../images/NintendoSwitch.png';
import DSImage from '../images/NintendoDS.png';
import Nintendo64 from '../images/Nintendo64.png';
import PSPImage from '../images/PSP.png';
import GameBoy from '../images/GameBoy.png';
import GameCube from '../images/GameCube.png';
import Wii from '../images/Wii.png';
import WiiU from '../images/WiiU.png';
import XboxSeriesX from '../images/XboxSeriesX.png';
import nintendo3DS from '../images/nintendo3DS.png';
import playstationImage from '../images/PlayStation.png';
import ps5Image from '../images/PlayStation5.png';
import DreamCast from '../images/Dreamcast.png';
import PlayStation2 from '../images/PlayStation2.png';

const Tabs = ({ platforms, selectedPlatform, onSelect }) => {
  const getImagePath = (platform) => {
    platform = platform.replace(' ', '');
    switch (platform) {
      case 'PC':
        return pcImage;
      case 'PlayStation 4':
        return ps4Image;
      case 'PlayStation 3':
        return ps3Image;
      case 'Xbox One':
          return xboxOneImage;
      case 'Xbox':
          return xboxImage;
      case 'Xbox 360':
          return xbox360Image;
      case 'Switch':
        return switchImage;
      case 'Nintendo DS':
        return DSImage;
      case '3DS':
        return nintendo3DS;
      case 'Nintendo 64':
        return Nintendo64;
      case 'PSP':
        return PSPImage;
      case 'GameBoy':
        return GameBoy;
      case 'GameCube':
        return GameCube;
      case 'Wii':
        return Wii;
      case 'Wii U':
        return WiiU;
      case 'Xbox Series X':
        return XboxSeriesX;
      case 'PlayStation':
        return playstationImage;
      case 'PlayStation 5':
        return ps5Image;
      case 'Dreamcast':
        return DreamCast;
      case 'PlayStation 2':
        return PlayStation2;
      default:
        return ''; // Handle default case or provide a default image
    }
  };
  
  return (
    <div className="tabs">
      {platforms.map((platform) => (
        <button
          key={platform}
          onClick={() => onSelect(platform)}
          className={`tab-button ${selectedPlatform === platform ? 'active' : ''}`}
        >
          {getImagePath(platform) === '' ? (
            <p>{platform}</p>
          ) : (
            <img src={getImagePath(platform)} alt={platform} />
          )}
        </button>
      ))}
    </div>
  );
};



export default Tabs;