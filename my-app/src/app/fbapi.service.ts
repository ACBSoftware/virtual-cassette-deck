import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PlayerStatus } from './fbapi.interface';
import { Observable } from 'rxjs';
import { defaultConfig } from './configconstants';

@Injectable({providedIn: 'root'})
export class FBAPIService {
    stdPostHeaders = new HttpHeaders({ 'Accept': '*/*'});
    constructor(private http: HttpClient) { }
    
    pause()
    {
        console.log('pause()')
        const body=undefined;
        this.http.post<any>(defaultConfig.BASE_URL_FOOBAR + '/api/player/pause/toggle',body,{ headers: this.stdPostHeaders }).subscribe(
            { 
              next: data=>{ },
              error: error=>{
                          console.log('ERROR:')  
                          console.log(error)
                        } 
            } ) 
    }

    next()
    {
        console.log('next()')
        const body=undefined;
        this.http.post<any>(defaultConfig.BASE_URL_FOOBAR + '/api/player/next',body,{ headers: this.stdPostHeaders }).subscribe(
            { 
              next: data=>{ },
              error: error=>{
                          console.log('ERROR:')  
                          console.log(error)
                        } 
            } ) 
    }

    previous()
    {
        console.log('previous()')
        const body=undefined;
        this.http.post<any>(defaultConfig.BASE_URL_FOOBAR + '/api/player/previous',body,{ headers: this.stdPostHeaders }).subscribe(
            { 
              next: data=>{ },
              error: error=>{
                          console.log('ERROR:')  
                          console.log(error)
                        } 
            } ) 
    }

    stop()
    {
        console.log('stop()')
        const body=undefined;
        this.http.post<any>(defaultConfig.BASE_URL_FOOBAR + '/api/player/stop',body,{ headers: this.stdPostHeaders }).subscribe(
            { 
              next: data=>{ },
              error: error=>{
                          console.log('ERROR:')  
                          console.log(error)
                        } 
            } ) 
    }

    play()
    {
        console.log('play()')
        const body=undefined;
        this.http.post<any>(defaultConfig.BASE_URL_FOOBAR + '/api/player/play',body,{ headers: this.stdPostHeaders }).subscribe(
            { 
              next: data=>{ },
              error: error=>{
                          console.log('ERROR:')  
                          console.log(error)
                        } 
            } ) 
    }

    getStatus()
    {
      /*
          http://localhost:8880/api/query?player=true&trcolumns=%25title%,%25artist%25,%25filename%25,%25path%25&playlists=true
      */  
      console.log('getStatus()')
      const headers = new HttpHeaders({ 'accept': 'application/json' });
      return this.http.get<PlayerStatus>(defaultConfig.BASE_URL_FOOBAR + defaultConfig.STATUS_QUERY,{ headers })
    }

    getArtwork(playlistIndex :number, itemIndex: number ): Observable<Blob>
    {
        const urlPath = defaultConfig.BASE_URL_FOOBAR + '/api/artwork/' + playlistIndex.toString() + '/' + itemIndex.toString();
        console.log(urlPath)
        return this.http.get(urlPath, { responseType: 'blob' });
    }

    addFilesToPlaylist(playListId :string, fileItems: string[] )
    {
        const postHeaders = new HttpHeaders({ 'Accept': '*/*','Content-Type':'application/json'});
        const urlPath = defaultConfig.BASE_URL_FOOBAR + '/api/playlists/' + playListId+ '/items/add' 
        const body=JSON.stringify({items: fileItems});
        this.http.post<any>(urlPath,body,{ headers: this.stdPostHeaders }).subscribe(
            { 
              next: data=>{ 
                console.log(data)

              },
              error: error=>{
                          console.log('ERROR:')  
                          console.log(error)
                        } 
            } ) 
    }

  }