import { Component } from '@angular/core';
import { fadeInOut } from './animations/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
  animations:[fadeInOut]
})
export class AppComponent {
  title = 'BonosEmpleadosNgApp';
  showLogin: boolean = false;
}
