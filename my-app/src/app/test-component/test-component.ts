import { Component, ElementRef, ViewChild } from '@angular/core';
import { VuDisplayComponent } from '../vu-display/vu-display.component';
import { songs } from './songs';
import { TapeDisplayComponent } from '../tape-display/tape-display.component';
import { ControlButtonsComponent } from '../control-buttons/control-buttons.component';





@Component({
  selector: 'app-product-list',
  templateUrl: './test-component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent {
  @ViewChild('myCanvas') myCanvas!: ElementRef;
  @ViewChild(VuDisplayComponent) vumeter!: VuDisplayComponent;
  @ViewChild(TapeDisplayComponent) tapeDisplay!: TapeDisplayComponent;
  @ViewChild(ControlButtonsComponent) controls!: ControlButtonsComponent;
  
  name: string ='Test Tape Label';
  audio = new Audio();
  currentindex = 0;
  currentMeter = 0; 

  change(event: Event){
      if (event && event.target)
      {
        console.log(event.target)
        this.tapeDisplay.setLabelText(this.name);
      }
  }

  ngAfterViewInit()
  {
    this.audio.id = "aud"
    this.audio.src = '/assets/test1.mp3';
    this.audio.controls = true;
    //audio.autoplay = true;
    document.body.appendChild(this.audio); 
    this.vumeter.initTheMeter(this.audio);
    this.tapeDisplay.playMovie();
    this.controls.isPlaying = true;

  }

  async onToggleMeter() { 
    if (this.currentMeter > 0 )
    {
      this.vumeter.onCancelMeter(); 
    }
    if (this.currentMeter == 1)
    {
      this.currentMeter = 2;
      this.vumeter.startMeter2();
    }
    else
    {
      this.currentMeter = 1;
      this.vumeter.startMeter1();
    }
    
  }
  async onCancelMeter() { 
    this.vumeter.onCancelMeter(); 
    this.audio.pause();
    this.tapeDisplay.pauseMovie();  
    this.controls.isPlaying = false;
  }

  handlePlay(event: string){
    if (this.controls.isPaused)
    {
      this.audio.play();
      this.tapeDisplay.playMovie();  
      this.controls.isPlaying = true;
      this.controls.isPaused = false;
    }
  }

  handlePause(event: string){
    if (this.controls.isPlaying) {
      this.audio.pause();
      this.tapeDisplay.pauseMovie();  
      this.controls.isPlaying = false;
      this.controls.isPaused = true;
    }
    else
    {
      this.audio.play();
      this.tapeDisplay.playMovie();  
      this.controls.isPlaying = true;
      this.controls.isPaused = false;
    }
  }
  handleFF(event: string){
    this.currentindex++;
      if (this.currentindex > (songs.length-1)) 
      { this.currentindex = 0;}
    
      this.audio.pause();
      this.controls.isPaused = true;
      this.controls.isPlaying = false;
      this.audio.src=songs[this.currentindex].url;
      this.audio.play();
      this.controls.isPaused = false;
      this.controls.isPlaying = true;
      this.tapeDisplay.playMovie();
      
      if (songs[this.currentindex].title.length < 19) {
        this.tapeDisplay.setLabelText(songs[this.currentindex].artist + ' - ' + songs[this.currentindex].title);
      }
      else
      {
        this.tapeDisplay.setLabelText(songs[this.currentindex].title);
      }
  }
  handleRew(event: string){
    this.currentindex--;
    if (this.currentindex < 0) 
    { this.currentindex = songs.length-1;}
  
    this.audio.pause();
    this.controls.isPaused = true;
    this.controls.isPlaying = false;
    this.audio.src=songs[this.currentindex].url;
    this.audio.play();
    this.tapeDisplay.playMovie();
    this.controls.isPaused = false;
    this.controls.isPlaying = true;
    if (songs[this.currentindex].title.length < 19) {
      this.tapeDisplay.setLabelText(songs[this.currentindex].artist + ' - ' + songs[this.currentindex].title);
    }
    else
    {
      this.tapeDisplay.setLabelText(songs[this.currentindex].title);
    }

  }
}

