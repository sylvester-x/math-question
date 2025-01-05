import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DivideComponent } from './divide/divide.component';
import { MinusComponent } from './minus/minus.component';
import { MultipleComponent } from './multiple/multiple.component';
import { AddComponent } from './add/add.component';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { MixMathComponent } from './mix-math/mix-math.component';

const routes: Routes = [
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'minus',
    component: MinusComponent
  },
  {
    path: 'multiple',
    component: MultipleComponent
  },
  {
    path: 'divide',
    component: DivideComponent
  },
  {
    path: 'mix',
    component: MixMathComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }]
})
export class AppRoutingModule {}
