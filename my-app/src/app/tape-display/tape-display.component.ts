import { Component, ElementRef, ViewChild } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tape-display',
  standalone: true,
  imports:[NgIf],
  templateUrl: './tape-display.component.html',
  styleUrl: './tape-display.component.scss'
})
export class TapeDisplayComponent {
  currentTape: number = 0;
  @ViewChild('vidTape') vid!: ElementRef;
  labelText: string ='AWESOME MIX VOLUME 20';

  setLabelText(str: string)
  {
    this.labelText = str;
  }
  pauseMovie()
  {
    this.vid.nativeElement.pause();
  }
  playMovie()
  {
    this.vid.nativeElement.play();
  }
  tapeIsPlaying()
  {
    return !this.vid.nativeElement.paused;
  }
  toggleTape()
  {
    if (this.currentTape === 0)
    {
      this.currentTape = 1;
    }
    else
    {
      this.currentTape = 0;
    }
  }
}
