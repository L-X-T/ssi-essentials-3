import { Component } from '@angular/core';
import { FlightSearchComponent } from './components/flight-search/flight-search.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';

@Component({
  standalone: true,
  imports: [SidebarComponent, NavbarComponent, FlightSearchComponent],
  selector: 'app-flight-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Hello World!';
}
