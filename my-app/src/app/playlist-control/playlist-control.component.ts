import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtilsAPIService } from '../utilsapi.service';
import { FolderFilter, MetaResult, SearchResult } from '../utils.interface';
import { CommonModule } from '@angular/common';
import { FBAPIService } from '../fbapi.service';

@Component({
  selector: 'app-playlist-control',
  standalone: false,
  templateUrl: './playlist-control.component.html',
  styleUrl: './playlist-control.component.scss'
})

export class PlaylistControlComponent {
  constructor(private utilsapi: UtilsAPIService,
              private fbapi: FBAPIService, 
              private router: Router) { }

              searchText: string=''
              currentResults: MetaResult = {folders:[], results:[]}
              folderFilters: FolderFilter[]=[]
              searchResults: SearchResult[]=[]
              resultsLabel: string=''
              selectedResults: SearchResult[]=[]

  onGoBack()
  {
    this.router.navigate(['']);
  }
  
  onSetFolderFilter(dbid: number, id: number)
  {
    const findFolder = this.folderFilters.filter(x=>x.id===id)
    if (findFolder.length>0)
    {
      this.resultsLabel = "Results: " + findFolder[0].count.toString() + " Folder: " + findFolder[0].name
      if (id===-1)
      {
        this.searchResults=this.currentResults.results.filter(x=>x.is_file===true);  
      }
      else
      {
        // Note if you don't filter on isfile true here you get subfolders which I need to handle
        this.searchResults=this.currentResults.results.filter(x=>x.parent_id==id && x.is_file===true)
        if (this.searchResults.length ===0)
        {
          //Nothing found in this folder, which probably means the folder itself was the search it.
          //Therefore, we'll make an API call just to get all files in the folder and merge them in.
          this.utilsapi.getFolderContentsById(dbid,findFolder[0].id).subscribe({
            next: data=>{ 
              this.searchResults=data.filter(x=>x.is_file===true); 
              this.searchResults.forEach((r) => {
                if (this.currentResults.results.filter(x=>x.id == r.id && x.fid == r.fid).length==0)
                {
                  this.currentResults.results.push(r);  
                }
              })
            },
            error: error=>{
               console.log(error)
          }})

        }

      }
    }
  }
  onSearch(searchString: string)
  {
    console.log(searchString)
    this.folderFilters=[];
    this.utilsapi.getSearchResults(searchString).subscribe({
      next: data=>{ 
         this.currentResults = data;
         const allFiles = data.results.filter(x=>x.is_file===true)
         const filesCount = allFiles.length
         this.resultsLabel = "Results: " + filesCount.toString();
         this.searchResults = allFiles
         //this.searchResults.forEach((item) => item.name = item.name.replace('.mp3',''));
         const all:FolderFilter = {name: 'All', id: -1, count:filesCount, dbid:-1}
         this.folderFilters.push(all)
         const foldersFound = data.results.filter(x=>x.is_file===false)
                .map( e => {
                  const counter = data.results.filter(x=>x.is_file===true && x.parent_id === e.id).length
                  const x:FolderFilter = {name: e.name, id: e.id, count:counter, dbid: e.fid}
                  this.folderFilters.push(x)
                  } )
      },
      error: error=>{
         console.log(error)
    }})
  }
  checkChange(dbid: number, id: number)
  {
    if (this.selectedResults.length == 0)
    {
        //Nothing in the list so add this. 
        console.log("First add")
        const itemfound = this.searchResults.filter(x=>x.fid === dbid && x.id === id).map( e => {
          this.selectedResults.push(e) 
        } )
    }
    else
    {
      const currentSize = this.selectedResults.length;
      this.selectedResults = this.selectedResults.filter(x=>!(x.id==id && x.fid == dbid))
      if (this.selectedResults.length === currentSize)
      {
        //If we didn't remove anything we need to add... 
        const item = this.searchResults.filter(x=>x.fid === dbid && x.id === id)[0]
        this.selectedResults.push(item);
        console.log("added")
      }
      else
      {
        console.log("removed")
      }
      
    }
  }

  onAddChecked()
  {
    //Selected ids is populated from UI...
    this.processAddSelected();
  }
  onAddAll()
  {
    //Note the api will not let you add non-library files like the main app!
    //let filesToAdd:string[]=[]
    //filesToAdd.push("C:\\Temp\\whatever.mp3")
    //this.fbapi.addFilesToPlaylist('p1',filesToAdd)

    this.selectedResults=[];
    this.searchResults.forEach((item) => this.selectedResults.push(item));
    this.processAddSelected();
  }

  processAddSelected()
  {
    let filesToAdd: string[] =[]
    this.selectedResults.forEach((r) => {

      // Attempt to walk it back to root folder, building file name... 
      // If we don't have the subfolders, will retrieve from python API
      const endFile = this.currentResults.results.filter(x=>x.id === r.id && x.fid === r.fid)[0]
      const fid = endFile.fid
      let finalFileName = '\\' + endFile.name
      let prevParent = endFile.parent_id
      let nextLevelUp = this.currentResults.results.filter(x=>x.id === prevParent)
      
      while (nextLevelUp.length > 0)
      {
        finalFileName = '\\' + nextLevelUp[0].name + finalFileName
        prevParent = nextLevelUp[0].parent_id
        nextLevelUp = this.currentResults.results.filter(x=>x.id === prevParent)
      }
      if (prevParent === 0)
      {
        //Yes we made it all the way, add root and cal API to add...
        const rootPath = this.currentResults.folders.filter(x=>x.fid === fid)[0].rootpath
        finalFileName = rootPath + finalFileName
        filesToAdd.push(finalFileName)
      }
      else
      {
        //No did not have all the folders??
        console.log('ERROR->' + finalFileName)
      }
    });
    if (filesToAdd.length>0)    
    {
      console.log(filesToAdd)
      console.log(this.utilsapi.currentPlaylistId)
      this.fbapi.addFilesToPlaylist(this.utilsapi.currentPlaylistId,filesToAdd)
    }
    this.selectedResults = [];

  }


}
