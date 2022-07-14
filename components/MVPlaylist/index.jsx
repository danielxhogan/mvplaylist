import { useState } from 'react';
import { signIn } from 'next-auth/react';

import PlaylistWindow from './PlaylistWindow';
import VideoWindow from './VideoWindow';
import styles from '../../styles/css/MVPlaylist.module.css';

import { useSelector } from 'react-redux';

const SHOWN = 'shown';
const HIDDEN = 'hidden';

const FULL = 'full';
const HALF = 'half';

export default function MVPlaylist() {
  const [ videoShownHidden, setVideoShownHidden ] = useState(HIDDEN);
  const [ playlistScreenSize, setPlaylistScreenSize ] = useState(FULL);
  
  const theme = useSelector(state => state.theme);
  const playlistItems = useSelector(state => state.playlistItems);

  if (playlistItems.error && playlistItems.error.status === 401) {
    signIn('spotify');
  }

  const onClickToggleView = () => {
     switch (videoShownHidden) {
      case HIDDEN: setVideoShownHidden(SHOWN); break;
      case SHOWN: setVideoShownHidden(HIDDEN); break;
     }

     switch (playlistScreenSize) {
      case FULL: setPlaylistScreenSize(HALF); break;
      case HALF: setPlaylistScreenSize(FULL); break;
     }
  };

  return (
    <div className={styles[theme]}>
    <button
    className={styles['toggle-view-btn']}
      onClick={onClickToggleView}
      >
      Toggle View
    </button>
    <div className={styles['mvplaylist']}>
      <PlaylistWindow screenSize={playlistScreenSize} />
      { console.log(`playlistScreenSize: ${playlistScreenSize}`) }
      <VideoWindow shownHidden={videoShownHidden} />
    </div>
    </div>
  );
}