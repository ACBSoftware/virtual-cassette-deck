export interface ActiveItem  {
    columns: string[];
    duration: number;
    index: number;
    playlistId: string;
    playlistIndex: number;
    position: number;
}

export interface Info  {
    name: string;
    pluginVersion: string;
    title: string;
    version: string;
}

export interface Playlist  {
      id: string;
      index: number;
      isCurrent: boolean;
      itemCount: number;
      title: string;
      totalTime: number;
}

export interface PlayerStatus  {
    player:{
        activeItem: ActiveItem;
        info: Info;
        options: any[];
        playbackMode: number;
        playbackState: string;
    };
    playlists: Playlist[];
}





