export interface Song {
    id: number;
    title: string;
    artist: string;
    url: string;
  }
  
  export const songs = [
    {
      id: 1,
      title: 'Test 1 Song',
      artist: 'Artist 1',
      url: '/assets/test1.mp3'

    },
    {
        id: 2,
        title: 'Test 2 Song',
        artist: 'Artist 2',
        url: '/assets/test2.mp3'
    }
  ];
  