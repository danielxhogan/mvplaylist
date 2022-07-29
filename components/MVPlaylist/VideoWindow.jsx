import Image from 'next/image';
import { useRouter } from 'next/router';

import { useDispatch, useSelector } from 'react-redux';
import { addVideoAction } from '../../redux/actions/youtubeActions';
import { GET_YOUTUBE_RESULTS_REFRESH } from '../../redux/types/youtubeTypes';

import styles from '../../styles/css/VideoWindow.module.css';

export default function VideoWindow({
  shownHidden,
  setViewCollapsed
}) {
  const router = useRouter();
  const { playlistId } = router.query;

  const dispatch = useDispatch();
  const theme = useSelector(state => state.theme);
  const accessToken = useSelector(state => state.accessToken);
  const userId = useSelector(state => state.userId);
  const video = useSelector(state => state.video);
  const {
    data: youtubeResults,
    query,
    songId
  } = useSelector(state => state.youtubeResults);

  const onSubmitAddVideo = (e) => {
    e.preventDefault();
    if (e.target['yt-radio-group'] && e.target['yt-radio-group'].value) {
      setViewCollapsed();
      const videoId = e.target['yt-radio-group'].value;
      console.log(`videoId: ${videoId}`)

      dispatch({ type: GET_YOUTUBE_RESULTS_REFRESH });
      dispatch(addVideoAction(userId, playlistId, songId, videoId))
    };
  };

  const onClickCancelBtn = () => {
    setViewCollapsed();
    dispatch({ type: GET_YOUTUBE_RESULTS_REFRESH });
  };

  const renderVideos = () => {
    return (
      youtubeResults.items && youtubeResults.items.map(video => {
        return (
          <div
            key={video.id.videoId}
            className={styles['video-item']}
            >

            <div>
              <input
                type='radio'
                value={video.id.videoId}
                name='yt-radio-group'
              />
            </div>

            <div>
              <Image
                src={video.snippet.thumbnails.default.url}
                width={video.snippet.thumbnails.default.width}
                height={video.snippet.thumbnails.default.height}
                alt='video thumbnail'
              />
            </div>

            <div className={styles['video-item-content']}>
              <div className={styles['video-content-title']} >
                { video.snippet.title }
              </div>
              <div>
                { video.snippet.description }
              </div>
            </div>

          </div>
        );
      })
    );
  };

  return (
    <div className={`
      ${styles[theme]}
      ${styles['window']}
      ${styles[shownHidden]}
      `}>
      <div className={`
        ${styles['video-window']}
        `}>

        {youtubeResults && youtubeResults.items &&
          <form
            className={styles['video-select-form']}
            onSubmit={onSubmitAddVideo}
            >

            <div>
              { query }
              { youtubeResults && renderVideos() }
            </div>

            <div className={styles['video-btns']}>
              <div>
                <button
                  className={styles['add-video-btn']}
                  type='submit'
                  >
                  Add Video
                </button>
              </div>

              <div onClick={onClickCancelBtn}>
                <button
                  className={styles['cancel-btn']}
                  >
                  Cancel
                </button>
              </div>
            </div>

          </form>
        }
        {video && video.videoId &&
          <iframe width="560" height="315" src={`https://www.youtube.com/embed/${video.videoId}`} title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        }

      </div>
    </div>
  );
};
