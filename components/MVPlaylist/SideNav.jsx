import styles from '../../styles/css/SideNav.module.css';

import { getAllPlaylistsAction } from '../../redux/actions/playlistActions';
import { useSelector, useDispatch } from 'react-redux';

import { useState } from 'react';
import Link from 'next/link';

const SHOWN = 'shown';
const HIDDEN = 'hidden';

export default function SideNav() {
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const accessToken = useSelector(state => state.accessToken);
  const playlists = useSelector(state => state.playlists);

  const [ shownHidden, setShownHidden ] = useState(HIDDEN);

  const onClickChevronBtn = () => {
    switch (shownHidden) {
      case HIDDEN: setShownHidden(SHOWN); break;
      case SHOWN: setShownHidden(HIDDEN); break;
    }
  };

  const renderPlaylists = (playlists) => {
    return (playlists.map(playlist => {
      return (
        <Link key={playlist.id} href={`/mvplaylist/${playlist.id}`}>
        <div
          className={`
            ${styles['side-nav-item']}
            ${styles[shownHidden]}
          `}
          onClick={() => setShownHidden(HIDDEN)}
          >
          { playlist.name }
        </div>
        </Link>
      );
    }));
  };

  const renderPageButtons = () => {
    const pages = Math.ceil(playlists.total / 50);
    if (pages === 1) { return; }
    let pagesArray = [];
    for (let i=0; i<pages; i++) { pagesArray.push(i); }

    return (pagesArray.map(page => {
      return (
        <button
          key={page}
          className={`
            ${styles['page-button']}
            ${styles[shownHidden]}
            `}
          onClick={() => {
            dispatch(getAllPlaylistsAction(accessToken, 50*page))
          }}>
          {page+1}
        </button>
      );
    }));
  }

  return (
    <div className={styles[theme]}>
        <div className={styles['side-nav']}>
          <div className={`
            ${styles['toggle-container']}
            ${styles[shownHidden]}
            `}>
            <div
              className={`
                ${styles['toggle-button']}
                ${styles[shownHidden]}
                `}
              onClick={onClickChevronBtn}
              >
              <i className='fa-solid fa-angle-right' />
            </div>
            <div className={`
              ${styles['side-nav-title']}
              ${styles[shownHidden]}
              `}>
              Playlists
            </div>

            <div className={styles['playlist-container']}>
              { playlists.items && renderPlaylists(playlists.items) }
            </div>

            <div className={`
              ${styles['page-buttons']}
              ${styles[shownHidden]}
              `}>
              { renderPageButtons() }
            </div>

          </div>
        </div>
    </div>
  );
};