import { combineReducers } from 'redux';

import { updateTheme } from './themeReducers';

import {
  getAllPlaylistsReducer,
  getPlaylistItemsReducer
} from './playlistReducers';


import {
  getYoutubeResultsReducer,
  addVideoReducer,
  getVideosReducer,
  playVideoReducer
} from './youtubeReducers';

import {
  setAccessToken,
  setUserId
} from './userReducers';

const reducers = combineReducers({
  theme: updateTheme,

  playlists: getAllPlaylistsReducer,
  playlistItems: getPlaylistItemsReducer,

  youtubeResults: getYoutubeResultsReducer,
  addVideoStatus: addVideoReducer,
  videos: getVideosReducer,
  video: playVideoReducer,

  accessToken: setAccessToken,
  userId: setUserId
});

export default reducers;
