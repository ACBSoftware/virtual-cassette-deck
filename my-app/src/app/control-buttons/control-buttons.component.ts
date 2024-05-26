import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-control-buttons',
  standalone: true,
  imports: [],
  templateUrl: './control-buttons.component.html',
  styleUrl: './control-buttons.component.scss'
})
export class ControlButtonsComponent {
  isPlaying: boolean = false;
  isPaused: boolean = false;
  isRewHeld: boolean = false;
  isFFHeld: boolean = false;
  isStopped: boolean = false;
  @Output() playButtonEvent = new EventEmitter<string>(); 
  @Output() pauseButtonEvent = new EventEmitter<string>(); 
  @Output() stopButtonEvent = new EventEmitter<string>(); 
  @Output() ffButtonEvent = new EventEmitter<string>(); 
  @Output() rewButtonEvent = new EventEmitter<string>(); 

  pressPlay() {
    this.playButtonEvent.emit('play');
  }

  pressPause() {
    this.pauseButtonEvent.emit('pause');
  }
  pressFF() {
    this.ffButtonEvent.emit('ff');
  }
  pressRew() {
    this.rewButtonEvent.emit('rew');
  }
  pressStop() {
    this.stopButtonEvent.emit('stop');
  }

  touchRew() {
    this.isRewHeld = true;
  }
  touchRewEnd() {
    this.isRewHeld = false;
  }
  touchFF() {
    this.isFFHeld = true;
  }
  touchFFEnd() {
    this.isFFHeld = false;
  }
}
