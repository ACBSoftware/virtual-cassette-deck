export const defaultConfig = {

    BASE_URL_FOOBAR : "http://localhost:8880",
    BASE_URL_UTILS  : "http://localhost:8000",
    COL_TITLE       : 0,
    COL_ARTIST      : 1,
    COL_FILENAME    : 2,
    COL_FILEPATH    : 3,
    STATUS_QUERY    : "/api/query?player=true&trcolumns=%25title%,%25artist%25,%25filename%25,%25path%25&playlists=true"
    
} as const;


export interface InternetURL {
    id: number;
    buttonTitle: string;
    iconUrl: string;
    iconWidth: string;
    url: string;
  }
  export interface URLList extends Array<InternetURL> { }
  export const urls: URLList = [
    {
        id: 0,
        buttonTitle: 'YouTube',
        iconUrl:'assets/iconYouTube.webp',
        iconWidth: "120",
        url:'//www.youtube.com'
    },
    {
        id: 1,
        buttonTitle: 'YT Music',
        iconUrl:'assets/iconYouTubeMusic.jpg',
        iconWidth: "100",
        url:'//music.youtube.com'
    },
    {
        id: 2,
        buttonTitle: 'Pandora',
        iconUrl:'assets/iconPandora.jpg',
        iconWidth: "100",
        url:'//www.pandora.com'
    },
    {
        id: 3,
        buttonTitle: 'Spotify',
        iconUrl:'assets/iconSpotify.png',
        iconWidth: "150",
        url:'//www.spotify.com'
    }
  ];