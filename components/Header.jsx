import styles from '../styles/css/Header.module.css';

import {
  updateThemeLight,
  updateThemeDark
} from '../redux/actions/themeActions';
import { DARK, LIGHT } from '../redux/types/themeTypes';
import { useDispatch, useSelector } from 'react-redux';

import { useEffect, useState } from 'react';

import { useSession, signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

const SHOWN = 'shown';
const HIDDEN = 'hidden';

export default function Header({ home=false }) {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);

  const [ sunClass, setSunClass ] = useState(SHOWN);
  const [ moonClass, setMoonClass ] = useState(HIDDEN);
  const [ smScrSearchClass, setSmScrSearchClass ] = useState(HIDDEN);

  // When page first loads, set theme in browser if not already set.
  // If already set to light theme, update sun/moon icon.
  // Anytime theme value in redux store changes, check to make sure
  // redux theme matches localStorage theme. When switching between playlists,
  // redux refreshes any values not being set on page build, resets theme to
  // default DARK. This useEffect will run anytime theme changes and make
  // sure it matches localStorage.

  useEffect(() => {
    const localStorageTheme = localStorage.getItem('theme');

    if (!localStorageTheme) { localStorage.setItem('theme', DARK); }
    else if (localStorageTheme === DARK) { dispatch(updateThemeDark()); }
    else {
      (dispatch(updateThemeLight()));
      setSunClass(HIDDEN);
      setMoonClass(SHOWN);
    }
  }, [dispatch, theme])

  const onClickSunIcon = () => {
    localStorage.setItem('theme', LIGHT);
    dispatch(updateThemeLight());
    setSunClass(HIDDEN);
    setMoonClass(SHOWN);
  };

  const onClickMoonIcon = () => {
    localStorage.setItem('theme', DARK);
    dispatch(updateThemeDark());
    setMoonClass(HIDDEN);
    setSunClass(SHOWN);
  };

  const onClickMagGlass = () => {
    switch (smScrSearchClass) {
      case HIDDEN: setSmScrSearchClass(SHOWN); break;
      case SHOWN: setSmScrSearchClass(HIDDEN); break;
      default: break;
    }
  };
  
  const { data: session, status } = useSession();

  return (
    <div className={styles[theme]}>
    <div className={`
      ${styles['small-scr-search-bar']}
      ${styles[`${home ? 'home' : 'not-home'}`]}
      ${styles[smScrSearchClass]}
      `}>
      <input
        placeholder='Search Spotify...'
      />
    </div>

    <div className={`
      ${styles['topnav']}
      ${styles[`${home ? 'home' : 'not-home'}`]}
      `}>
      <div className={styles['logo-section']}>
        <Link href='/'>
        <div className={styles['logo']}>
          <Image
            src='/images/spotify-icons-logos/icons/Spotify_Icon_RGB_Green.png'
            width='30px'
            height='30px'
            alt='spotify logo'
          />

          <Image
            src='/images/youtube-icons-logos/yt_icon_rgb.png'
            width='45px'
            height='30px'
            alt='spotify logo'
          />
        </div>
        </Link>

        <Link href='/playlists'>
        <p>MVPlaylist</p>
        </Link>
      </div>

      <div className={`
        ${styles['search-bar']}
        ${styles[`${home ? 'home' : 'not-home'}`]}
        `}>
        <i
          className={`
            fa-solid fa-magnifying-glass fa-xl
            ${styles['magnifying-glass']}`}
          onClick={onClickMagGlass}
        />
        <input
          placeholder='Search Spotify...'
        />
      </div>

      <div className={styles['login']}>

        <div className={styles['theme-toggle-icon']}>
          <i
            className={`
              fa-solid fa-sun fa-xl
              ${styles['sun']}
              ${styles[sunClass]}`}
            onClick={onClickSunIcon}  
          />

          <i 
            className={`
              fa-solid fa-moon fa-xl
              ${styles['moon']}
              ${styles[moonClass]}`}
            onClick={onClickMoonIcon}
          />
        </div>

        {status === 'unauthenticated' &&
          <button onClick={() => signIn('spotify')}>
            Login to Spotify
          </button>
        }
        
        {status === 'authenticated' &&
          <button onClick={() => signOut()}>
            Sign Out
          </button>
        }

      </div>
    </div>
    </div>
  );
}