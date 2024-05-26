import { Component, ElementRef, ViewChild } from '@angular/core';
import { VuDisplayComponent } from '../vu-display/vu-display.component';
import { TapeDisplayComponent } from '../tape-display/tape-display.component';
import { ControlButtonsComponent } from '../control-buttons/control-buttons.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FBAPIService } from '../fbapi.service';
import { PlayerStatus } from '../fbapi.interface';
import { Router } from '@angular/router';
import { UtilsAPIService } from '../utilsapi.service';

@Component({
  selector: 'app-main-display',
  templateUrl: './main-display.component.html',
  styleUrl: './main-display.component.scss'
})

export class MainDisplayComponent {
  @ViewChild('myCanvas') myCanvas!: ElementRef;
  @ViewChild(VuDisplayComponent) vumeter!: VuDisplayComponent;
  @ViewChild(TapeDisplayComponent) tapeDisplay!: TapeDisplayComponent;
  @ViewChild(ControlButtonsComponent) controls!: ControlButtonsComponent;
  name: string ='';
  currentindex = 0;
  currentMeter = 0; 
  intervalID:any;
  currentStatus: PlayerStatus | undefined;
  artworkLoaded: string = '';
  currentImageBlob: Blob | undefined;
  showInitialButton: boolean = true;
  backgroundColor: string = 'rgb(118, 121, 119)';
  backgroundImage: string = '';
  backgroundCycle: number = -1;

  constructor(private http: HttpClient,
              private fbapi: FBAPIService,
              private utilsapi: UtilsAPIService,
              private router: Router) { 
                  if (utilsapi.isStarted){
                    this.showInitialButton = false;
                    this.currentMeter = utilsapi.lastMeter;
                    this.backgroundCycle = utilsapi.lastBackgroundCycle;
                  }
              }


ngAfterViewInit()
  {
    console.log('MAIN VIEW INIT')
    setTimeout(() =>{
      this.vumeter.initTheMeterSys();
      this.tapeDisplay.playMovie();
      this.controls.isPlaying = true;
      if (document.fullscreenElement) 
      {
        this.showInitialButton = false;
      }
      if (this.currentMeter == 1)  { this.vumeter.startMeter1();  }
      this.setBackGround();
    },500);
   
    this.intervalID = setInterval(() => { 
        this.fbapi.getStatus().subscribe(data => {
          this.currentStatus=data;
          this.showCurrentStatus();
        })
    },2200);
  }
 
  onStartButton()
  {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } 
    this.showInitialButton = false;
    this.utilsapi.setStartedState(); 
  }

  onShowFoobarPanel()
  {
    if (this.intervalID)
    {
      clearInterval(this.intervalID);
    }
    this.vumeter.onCancelMeter();
    this.router.navigate(['/foobar']);
  }
  async onToggleMeter() { 
    // TODO Maybe some constants...?
    //0 = No Meter / Blank
    //1 = Spectrum display
    //2 = Green VU Bar
    //3 = Album art
    if (this.currentMeter != 0)
    {
      this.vumeter.onCancelMeter(); 
    }
    if (this.currentMeter < 3)
    {
      this.currentMeter++;
    }
    else
    {
      this.currentMeter = 0;
      this.artworkLoaded = "";
      //this.utilsapi.launchImgPuller(); 
    }
    if (this.currentMeter == 1)  { this.vumeter.startMeter1();  }
    if (this.currentMeter == 2)  { this.vumeter.startMeter2();  }
    this.utilsapi.lastMeter = this.currentMeter;
  }

  showCurrentStatus()
  {
    // This function executes every 2 seconds, updates the tape label, video, buttons, album art
    if (this.currentStatus)
    {
      const cleanedItem = this.utilsapi.cleanCurrentItem(this.currentStatus.player.activeItem);
      this.tapeDisplay.setLabelText(cleanedItem.displayLabel); 
      this.utilsapi.currentPlaylistId = this.currentStatus.player.activeItem.playlistId;
      if (this.currentMeter==2)
      {
        this.vumeter.setCurrentSongInfo(cleanedItem.path,this.currentStatus.player.activeItem.position,this.currentStatus.player.activeItem.duration);
      }

      //Tape video and controls
      if (this.currentStatus.player.playbackState == "playing")
      {
          if (!this.tapeDisplay.tapeIsPlaying())
          {
            this.tapeDisplay.playMovie();
          }
          this.controls.isPlaying = true;
          this.controls.isPaused = false;
      }
      else
      {
          if (this.tapeDisplay.tapeIsPlaying())
          {
            this.tapeDisplay.pauseMovie();
          }
          this.controls.isPlaying = false;
          this.controls.isPaused = true;
      }

      //Album art
      if (this.currentMeter == 3 && this.currentStatus.player.playbackState=="playing")
      {
        // Going to try 3 times: 1. Foobar, 2. Queue Google Search, 3. Display result of search
        let tryFoobar = false;
        let tryPython = false; 
        const awKey = this.currentStatus.player.activeItem.playlistIndex.toString() + this.currentStatus.player.activeItem.index.toString();

        if (awKey != this.artworkLoaded)
        {
          if (this.artworkLoaded == "F" || this.artworkLoaded == "P")
          {
              tryPython = true;
          }
          else
          {
              tryFoobar = true; 
          }
        }
        else
        {
          if (this.currentImageBlob) {
            //If we got an image and it matches then display it...
            this.vumeter.displayAnImage(this.currentImageBlob);
          }
        }

        if (tryFoobar)
        {
          this.fbapi.getArtwork(this.currentStatus.player.activeItem.playlistIndex, this.currentStatus.player.activeItem.index).subscribe({
            next: data=>{ 
                console.log('Artwork retrieved (Foobar)')
                this.currentImageBlob = data;
                this.artworkLoaded = awKey;
            },
            error: error=>{
                        console.log('No artwork provided by Foobar, trying python service.')  
                        this.artworkLoaded = "F";
                      } 
          })
        }
        
        if (tryPython)
        {
          const searchString = cleanedItem.artist + ' - ' +  cleanedItem.title;
          this.utilsapi.getCoverArt(searchString).subscribe({
            next: data=>{ 
                console.log('Artwork retrieved (Python)')
                this.currentImageBlob = data;
                this.artworkLoaded = awKey;
            },
            error: error=>{
                        
                        if (this.artworkLoaded == "F")
                        {
                          this.artworkLoaded = awKey;
                          console.log('No artwork provided by Python, trying once more...')  
                          this.utilsapi.launchImgPuller().subscribe({
                              next: data=>{
                                this.artworkLoaded = "P";
                              }
                          });
                        }
                        else
                        {
                          console.log('No artwork provided by Python, done.')  
                          this.artworkLoaded = awKey;
                          this.currentImageBlob = undefined;
                          this.vumeter.clearImage();
                        }
                      } 
          })

          
        }
      } // playing state
    } // we have currentStatus
  }

  handlePlay(event: string){
    this.fbapi.play();
    this.controls.isPaused = false;
    this.controls.isStopped = false;
    this.controls.isPlaying = true;
    this.tapeDisplay.playMovie();
  }

  handlePause(event: string){
    this.fbapi.pause();
    this.controls.isStopped = false;
    if (this.controls.isPaused) {
      this.tapeDisplay.playMovie();
    }
    else
    {
      this.tapeDisplay.pauseMovie();
    }
    this.controls.isPaused = !this.controls.isPaused;
    this.controls.isPlaying = !this.controls.isPlaying;
  }

  handleFF(event: string){
    this.fbapi.next();
  }

  handleRew(event: string){
    this.fbapi.previous();
  }

  handleStop(event: string){
    this.fbapi.stop();
    this.controls.isPlaying = false;
    this.controls.isPaused = false;
    this.controls.isStopped = true;
    this.tapeDisplay.pauseMovie();
  }

  onBluetooth()
  {
    if (this.controls.isPlaying) {
      this.fbapi.stop();
    }
    this.utilsapi.launchBt();
  }

  setBackGround()
  {
    if (this.backgroundCycle < 1)
      {
        if (this.backgroundCycle==0) {
          this.backgroundColor='rgb(118, 121, 119)';
        }
        this.backgroundImage='';
      }
      else
      {
        this.backgroundImage='url("/assets/bg' + this.backgroundCycle + '.jpg")'
      }
    this.utilsapi.lastBackgroundCycle = this.backgroundCycle;
  }
  onBGDivClick()
  {
    this.backgroundCycle = this.backgroundCycle + 1;
    if (this.backgroundCycle > 4)
    {
      this.backgroundCycle = 0;
    }
    this.setBackGround();
  }
}

