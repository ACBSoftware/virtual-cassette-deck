export interface CleanedFileInfo  {
    title: string;
    artist: string;
    file: string;
    path: string;
    displayLabel: string;
}

export interface SearchResult  {
    fid: number;
    id: number;
    parent_id: number; 
    name: string;
    is_file: boolean;
}
export interface MusicFolder  {
    fid: number;
    dbpath: string;
    rootpath: string;
}
export interface MetaResult  {
    folders: MusicFolder[]
    results: SearchResult[]
}
export interface FolderFilter  {
    name: string;
    id: number;
    count: number;
    dbid: number;
}



