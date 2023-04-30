import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { JeuDemineurPageRoutingModule } from './jeu-demineur-routing.module';

import { JeuDemineurPage } from './jeu-demineur.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    JeuDemineurPageRoutingModule
  ],
  declarations: []
})
export class JeuDemineurPageModule {}
