import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-vu-display',
  standalone: true,
  imports: [],
  templateUrl: './vu-display.component.html',
  styleUrl: './vu-display.component.scss'
})
export class VuDisplayComponent {
  @ViewChild('vuCanvas') vuCanvas!: ElementRef;
  intervalID:any;
  audioContext = new AudioContext();
  analyzerNode = this.audioContext.createAnalyser();
  audio = new Audio();
  imageXOffset: number = 0;
  imageIncrement: number = 2;
  WIDTH: number = 480;
  HEIGHT: number = 200;
  currentFile: string = "";
  currentPos: number = 0;
  currentDuration: number=0;

  initTheMeter(aud: HTMLAudioElement)
  {
    /* 
        This init routine is for testing with browser-initiated audio
    */
    this.audio = aud;
    var source = this.audioContext.createMediaElementSource(this.audio);
    source.connect(this.analyzerNode);
    this.analyzerNode.connect(this.audioContext.destination);
    console.log(this.audioContext)
    console.log("VU Meter Init Executed (Local HTML)");
    this.audio.play();
  }

  async initTheMeterSys()
  {
    /* 
        This init routine is for Foobar - requires RealTek Stereo Mix configured
    */
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    var source = this.audioContext.createMediaStreamSource(stream);
    source.connect(this.analyzerNode);
    console.log(this.audioContext)
    console.log("VU Meter Init Executed (Stereo Mix)");
    //this.listDevices();
  }

  howManyLitSegments(level: number)
  {
    const SEGMENTS = 10;
    const MAX_LEVEL= 256
    const levelsPer = MAX_LEVEL / SEGMENTS;
    return Math.round(level/levelsPer)
  }
  
  listDevices()
  {
    navigator.mediaDevices
    .enumerateDevices()
    .then((devices) => {
      devices.forEach((device) => {
        console.log(`${device.kind}: ${device.label} id = ${device.deviceId}`);
      });
    })
    .catch((err) => {
      console.error(`${err.name}: ${err.message}`);
    });
  }

  onCancelMeter() {
    if (this.intervalID)
    {
      clearInterval(this.intervalID);
    }
    const canvas = this.vuCanvas.nativeElement;
    const canvasContext = canvas.getContext('2d');
    canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
  }

  startMeter1() {

    this.intervalID = setInterval(() => {

      this.analyzerNode.fftSize = 32;
      var bufferLength = this.analyzerNode.frequencyBinCount;
      var frequencyData = new Uint8Array(this.analyzerNode.frequencyBinCount);
      this.analyzerNode.getByteFrequencyData(frequencyData);
      const canvas = this.vuCanvas.nativeElement;
      const canvasContext = canvas.getContext('2d');
    
      // Set the canvas size to match the frequency data.
      canvasContext.width = frequencyData.length;
      canvasContext.height = 256;
      canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      canvasContext.fillStyle = 'rgb(0, 0, 0)';
      canvasContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  
      var barWidth = 20;// (WIDTH / bufferLength) * 2.5;
      var barHeight;
      var x = 0;
      for(var i = 0; i < bufferLength; i++) {
          
          const litSegments =  this.howManyLitSegments(frequencyData[i])
          for (var j=0; j<litSegments;j++)
          {
            if (j>5){
              canvasContext.fillStyle = 'rgb(255,50,50)';
            }
            else
            {
              canvasContext.fillStyle = 'rgb(114,219,236)';
            }
            const yOffSet = 10;
            canvasContext.fillRect(x,140 - (j*yOffSet*1.1),barWidth,3);        
            canvasContext.fillRect(x,140 - (j*yOffSet*1.1) - 5,barWidth,3); 
          }
        x += barWidth + 3;
      }
    }, 100);

  }
  setCurrentSongInfo(file: string,  pos: number,  duration: number)
  {
      this.currentFile = file;
      this.currentDuration = duration;
      this.currentPos = pos;
  }
  startMeter2() {

    this.intervalID = setInterval(() => {
      
      this.analyzerNode.fftSize = 32;
      const pcmDataR = new Float32Array(this.analyzerNode.fftSize);
      this.analyzerNode.getFloatTimeDomainData(pcmDataR);
      let sumR = 0.0;
      let sumL = 0.0; //TODO: Add splitter object and separate channels
      for (const amplitude of pcmDataR) {
        sumR += amplitude * amplitude;
      }
      const valueR = Math.sqrt(sumR / pcmDataR.length);
     
      const canvas = this.vuCanvas.nativeElement;
      const canvasContext = canvas.getContext('2d');
    
      canvasContext.width = 480
      canvasContext.height = 256;
      canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
      canvasContext.fillStyle = 'rgb(0, 0, 0)';
      canvasContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  
      const litSegments = this.howManyLitSegments2(valueR);
      var barHeight = 25;
      var barWidth = valueR * this.WIDTH;
      canvasContext.fillStyle = 'rgb(24,223,155)';
      canvasContext.fillRect(10,10,barWidth,barHeight);
      for (var j=0; j<litSegments;j++)
      {
        canvasContext.fillRect(10 + (15*j)+5,40,2,barHeight);
        canvasContext.fillRect(10 + (15*j)+10,40,2,barHeight);
        canvasContext.fillRect(10 + (15*j)+15,40,2,barHeight +5);
      }

      canvasContext.font = 'bold 12px Orbitron';
      canvasContext.globalAlpha = 1.0;
      if (!this.currentFile.toLowerCase().endsWith("mp3"))
      {
        canvasContext.globalAlpha = 0.5;
      }
      canvasContext.fillText('MP3', 5, 100);
      canvasContext.globalAlpha = 1.0;
      if (!this.currentFile.toLowerCase().endsWith("flac"))
      {
        canvasContext.globalAlpha = 0.5;
      }
      canvasContext.fillText('FLAC', 100, 100);
      canvasContext.globalAlpha = 1.0;
      if (!this.currentFile.toLowerCase().endsWith("wav"))
      {
        canvasContext.globalAlpha = 0.5;
      }
      canvasContext.fillText('WAV', 50, 100);
      canvasContext.globalAlpha = 1.0;
      let pctDone = '';
      if (this.currentDuration > 0)
      {
        pctDone = (100 * (this.currentPos/this.currentDuration)).toFixed(0).toString() + '%';
      }
      canvasContext.fillText(pctDone, 165, 100);
    }, 150);

  }
  howManyLitSegments2(pct: number)
  {
    const SEGMENTS = 30;
    return Math.round(SEGMENTS * pct)
  }
  displayAnImage(imgBlob: Blob)
  {
    const canvas = this.vuCanvas.nativeElement;
    const canvasContext = canvas.getContext('2d');
    createImageBitmap(imgBlob).then(imageBitmap=>
          {
            const scale = Math.min(canvas.width / imageBitmap.width, canvas.height / imageBitmap.height);
            const newWidth = imageBitmap.width * scale;
            const newHeight = imageBitmap.height * scale;
            canvasContext.drawImage(imageBitmap,this.imageXOffset,0,newWidth,newHeight)
          
          })
          
    this.imageXOffset = this.imageXOffset + this.imageIncrement;
    if (this.imageXOffset > 200 || this.imageXOffset < 0)
    {
      this.imageIncrement = this.imageIncrement * -1;
    }
  }
  clearImage()
  {
    const canvas = this.vuCanvas.nativeElement;
    const canvasContext = canvas.getContext('2d');
  
    canvasContext.width = 480
    canvasContext.height = 256;
    canvasContext.clearRect(0, 0, this.WIDTH, this.HEIGHT);
    canvasContext.fillStyle = 'rgb(0, 0, 0)';
    canvasContext.fillRect(0, 0, this.WIDTH, this.HEIGHT);
  }

}
/*
  https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Visualizations_with_Web_Audio_API
 */ 