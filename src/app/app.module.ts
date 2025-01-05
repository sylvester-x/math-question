import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './_share/material/material.module';
import { FormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MultipleComponent } from './multiple/multiple.component';
import { AddComponent } from './add/add.component';
import { MinusComponent } from './minus/minus.component';
import { DivideComponent } from './divide/divide.component';
import { OnlyNumberDirective } from './_share/directives/only-number.directive';
import { MixMathComponent } from './mix-math/mix-math.component';

@NgModule({
  declarations: [
    AppComponent,
    MultipleComponent,
    AddComponent,
    MinusComponent,
    DivideComponent,
    OnlyNumberDirective,
    MixMathComponent
  ],
  imports: [BrowserModule, AppRoutingModule, BrowserAnimationsModule, MaterialModule, FormsModule, FlexLayoutModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
