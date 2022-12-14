import styles from '../styles/css/Playlists.module.css';

import { getAllPlaylistsAction } from '../redux/actions/playlistActions';
import { useSelector, useDispatch } from 'react-redux';

import Head from 'next/head'
import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react';

export default function Playlists() {
  const { data: session } = useSession();
  
  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const playlists = useSelector(state => state.playlists);

  if (playlists.error && playlists.error.status === 401) {
    signIn('spotify');
  }

  const renderPageButtons = () => {
    const pages = Math.ceil(playlists.total / 50);
    if (pages === 1) { return; }
    let pagesArray = [];
    for (let i=0; i<pages; i++) { pagesArray.push(i); }

    return (pagesArray.map(page => {
      return (
        <button
          key={page}
          className={styles['page-button']}
          onClick={() => {
            dispatch(getAllPlaylistsAction(session.accessToken, 50*page))
          }}>
          {page+1}
        </button>
      );
    }));
  }

  const renderPlaylistCards = (playlists) => {
    return (playlists.map(playlist => {
      return (
        <Link key={playlist.id} href={`/mvplaylist/${playlist.id}`}>
        <div className={styles['playlist-card']}>
          { playlist.name }
        </div>
        </Link>
      );
    }));
  };

  return (
    <div className={styles[theme]}>
      <div className={styles['playlists']}>
        <div className={`${styles['content']} ${styles['container']}`}>
          <Head>
            <title>mvplaylist</title>
          </Head>

          { playlists.loading ? (
            <p>loading</p>
          ):(
            <>
            <div className={styles['page-buttons']}>
              { renderPageButtons() }
            </div>
            <div className={styles['playlist-cards']}>
              { playlists.items && renderPlaylistCards(playlists.items) }
            </div>
            </>
          )}
          
        </div>
      </div>
    </div>
  );
};