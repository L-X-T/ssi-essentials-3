import { Component, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';

import { Flight } from '../entities/flight';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent {
  from = '';
  to = '';
  flights: Flight[] = [];
  selectedFlight?: Flight;

  private readonly http = inject(HttpClient);

  onSearch(): void {
    const url = 'http://www.angular.at/api/flight';
    const headers = new HttpHeaders().set('Accept', 'application/json');
    const params = new HttpParams().set('from', this.from).set('to', this.to);

    this.http.get<Flight[]>(url, { headers, params }).subscribe({
      next: (flights: Flight[]) => {
        console.log('Flights loaded: ', flights);
        this.flights = flights;
      },
      error: (errResp: HttpErrorResponse) => {
        console.error('Error loading flights', errResp);
      },
      complete: () => {
        console.debug('Flights loading completed.');
      }
    });
  }

  onSelect(selectedFlight: Flight): void {
    this.selectedFlight = selectedFlight;
  }
}
