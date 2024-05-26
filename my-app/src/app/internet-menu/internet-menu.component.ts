import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FBAPIService } from '../fbapi.service';
import { urls } from '../configconstants';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-internet-menu',
  standalone: true,
  imports: [NgFor],
  templateUrl: './internet-menu.component.html',
  styleUrl: './internet-menu.component.scss'
})
export class InternetMenuComponent {
  constructor(private router: Router,
              private fbapi: FBAPIService,) { }

              externalUrls = [...urls];
  onTest()
  {
    
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
  onGoBack()
  {
    this.router.navigate(['']);
  }
  goToLinkInNewWindow(url: string){
    this.fbapi.stop();
    window.open(url, '_blank', 'toolbar=0,location=0,menubar=0');
  }
}
