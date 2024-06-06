import { Component, Input } from '@angular/core';
import { contrast } from '../animations/animations';
import { TabManagerService } from '../tab-manager.service';

@Component({
  selector: 'tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.sass'],
  animations:[contrast]


})

export class TabComponent {

  @Input() tabData: any;
  tabName = "";

  isLargeFont = false;

  //run animation
  toggleFontSize()
  {
    this.tabName = this.tabData.view;

    this._tabManService.notify(this.tabName);

    this.isLargeFont = !this.isLargeFont;
  }


  constructor( private _tabManService: TabManagerService )
  {

  }

}
