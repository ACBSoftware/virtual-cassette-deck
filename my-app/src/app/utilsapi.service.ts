import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CleanedFileInfo, MetaResult, SearchResult } from './utils.interface';
import { ActiveItem } from './fbapi.interface';
import { defaultConfig } from './configconstants';

@Injectable({providedIn: 'root'})
export class UtilsAPIService {

  isStarted: boolean = false; 
  lastMeter: number = 0;
  lastBackgroundCycle: number = 0;
  currentPlaylistId: string ='p1';
    
  stdPostHeaders = new HttpHeaders({ 'Accept': '*/*'});
  constructor(private http: HttpClient) { }
  
  search(searchText:string)
    {
        console.log('search()')
        const body={searchQuery: searchText};
        this.http.post<any>(defaultConfig.BASE_URL_UTILS + '/search',body,{ headers: this.stdPostHeaders }).subscribe(
            { 
              next: data=>{ },
              error: error=>{
                          console.log('ERROR:')  
                          console.log(error)
                        } 
            } ) 
    }
    getCoverArt(searchText:string)
    {
        const urlPath = defaultConfig.BASE_URL_UTILS + '/coverart/' + searchText;
        console.log(urlPath)
        return this.http.get(urlPath, { responseType: 'blob' });
    }

    cleanCurrentItem(fbItem: ActiveItem): CleanedFileInfo
    {
        let retVal: CleanedFileInfo= { artist:'', title:'', file:'', path:'', displayLabel:''};
        if (fbItem.columns.length > 2) {
            const title = fbItem.columns[defaultConfig.COL_TITLE];
            const artist = fbItem.columns[defaultConfig.COL_ARTIST];
            const filename = fbItem.columns[defaultConfig.COL_FILENAME];
            const path = fbItem.columns[defaultConfig.COL_FILEPATH];

            retVal.artist = artist;
            retVal.title = title;
            retVal.file = filename;
            retVal.path = path;

            if (artist == '?' && title !=='?') 
            {
                if (title.includes('-')) {
                    let arSplit = title.split("-").map(item => item.trim());
                    if (arSplit.length > 1)
                    {
                        retVal.artist = arSplit[0];
                        retVal.title = arSplit[1];
                    }
                }
            }

            if (title.length < 21) {
              retVal.displayLabel = artist + ' - ' + title;
            }
            else
            {
              if (title.length > 48) {
                retVal.displayLabel = title.substring(0,48);
              }
              else {
                retVal.displayLabel = title;
              }
            }
          }
        return retVal;
    }

    getSearchResults(searchText:string)
    {
        const urlPath = defaultConfig.BASE_URL_UTILS + '/search/' + searchText;
        console.log(urlPath)
        return this.http.get<MetaResult>(urlPath);
    }

    getFolderContentsById(fid:number, id: number)
    {
        console.log('getFolderContents()')  
        const urlPath = defaultConfig.BASE_URL_UTILS + '/search/folderid/' + fid.toString() +'/' + id.toString();
        return this.http.get<SearchResult[]>(urlPath);
    }

    launchBt()
    {
        console.log('launchBt()')
        this.http.post<any>(defaultConfig.BASE_URL_UTILS + '/launchbt',undefined,{ headers: this.stdPostHeaders}).subscribe(
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

    launchImgPuller()
    {
        console.log('launchImgPuller()')
        return this.http.post<any>(defaultConfig.BASE_URL_UTILS + '/launchimagepuller',undefined,{ headers: this.stdPostHeaders});
    }

    setStartedState()
    {
      this.isStarted = true; 
    }

  }