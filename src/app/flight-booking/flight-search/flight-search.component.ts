import { Component, DestroyRef, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormGroup } from '@angular/forms';

import { Flight } from '../../entities/flight';
import { FlightService } from '../../services/flight.service';
import { BehaviorSubject, Observable, Observer, Subject, Subscription } from 'rxjs';
import { share, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-flight-search',
  templateUrl: './flight-search.component.html',
  styleUrls: ['./flight-search.component.css']
})
export class FlightSearchComponent implements OnInit, OnDestroy {
  @ViewChild('flightSearchForm') flightSearchForm?: FormGroup;

  from = 'Hamburg';
  to = 'Graz';

  minLength = 3;
  maxLength = 15;

  flights: Flight[] = []; // old school
  flights$?: Observable<Flight[]>; // observable
  flightsSubject = new BehaviorSubject<Flight[]>([]); // subject
  flightsSignal = signal<Flight[]>([]); // signal
  flightsSubscription?: Subscription;
  // private readonly onDestroySubject = new Subject<void>();
  // readonly terminator$ = this.onDestroySubject.asObservable();

  selectedFlight: Flight | null = null;
  flightToEdit: Flight | null = null;

  message = '';

  private readonly destroyRef = inject(DestroyRef);
  private readonly flightService = inject(FlightService);
  // constructor(private flightService: FlightService) {}

  basket: { [id: number]: boolean } = {
    3: true,
    5: true
  };

  ngOnInit(): void {
    if (this.from && this.to) {
      this.onSearch();
    }
  }

  onSearch(): void {
    if (this.flightSearchForm?.invalid) {
      this.markFormGroupDirty(this.flightSearchForm);
      return;
    }

    // 1. my observable
    this.flights$ = this.flightService.find(this.from, this.to).pipe(share());

    // 2. my observer
    const flightsObserver: Observer<Flight[]> = {
      next: (flights) => {
        this.flights = flights;
        this.flightsSubject.next(flights);
        this.flightsSignal.set(flights);
      },
      error: (errResp: HttpErrorResponse) => console.error('Error loading flights', errResp),
      complete: () => {
        // console.debug('Flights loading completed.');
      }
    };

    // 3a. my subscription
    this.flightsSubscription?.unsubscribe();
    this.flightsSubscription = this.flights$.subscribe(flightsObserver);

    // 3b. takeUntil terminator$ emits
    // this.flights$.pipe(takeUntil(this.terminator$)).subscribe(flightsObserver);

    // 3c. takeUntilDestroyed
    this.flights$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(flightsObserver);
  }

  ngOnDestroy(): void {
    // 4a. my unsubscribe
    this.flightsSubscription?.unsubscribe();

    // 4b. subject emit thru terminator$
    // this.onDestroySubject.next(void 0);
    // this.onDestroySubject.complete();

    // complete behavior subject
    this.flightsSubject.complete();
  }

  onSelectToggle(flight: Flight) {
    this.basket[flight.id] = !this.basket[flight.id];
    this.selectedFlight = this.basket[flight.id] ? flight : null;
  }

  /*onSave(): void {
    if (this.selectedFlight) {
      this.flightService
        .save(this.selectedFlight)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (flight) => {
            console.log('Flight saved: ', flight);
            this.selectedFlight = flight;
            this.message = 'Success!';
          },
          error: (errResponse: HttpErrorResponse) => {
            console.error('Error saving flight', errResponse);
            this.message = 'Error: ' + errResponse.message;
          }
        });
    }
  }*/

  trackById(index: number, flight: Flight): number {
    return flight.id;
  }

  removeSecondFlight() {
    this.flights = [{ ...this.flights[0] }, ...this.flights.slice(2)];
  }

  private markFormGroupDirty(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((c) => c.markAsDirty());
  }
}
