import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { TestComponent } from './test-component/test-component';
import { VuDisplayComponent } from './vu-display/vu-display.component';
import { TapeDisplayComponent } from './tape-display/tape-display.component';
import { ControlButtonsComponent } from './control-buttons/control-buttons.component';
import { PlaylistControlComponent } from './playlist-control/playlist-control.component';
import { InternetMenuComponent } from './internet-menu/internet-menu.component';
import { MainDisplayComponent } from './main-display/main-display.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VuDisplayComponent,
    TapeDisplayComponent,
    ControlButtonsComponent,
    InternetMenuComponent,
    HttpClientModule,
    
    RouterModule.forRoot([
      { path: '', component: MainDisplayComponent },
      { path: 'test', component: TestComponent },
      { path: 'foobar', component: PlaylistControlComponent },
      { path: 'inet', component: InternetMenuComponent }
    ])
  ],
  declarations: [
    AppComponent,
    TestComponent,
    MainDisplayComponent,
    PlaylistControlComponent
  ],
  bootstrap: [
    AppComponent
  ],
  exports : [VuDisplayComponent, TapeDisplayComponent, ControlButtonsComponent, InternetMenuComponent]
})
export class AppModule { }

