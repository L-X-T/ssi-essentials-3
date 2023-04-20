import { Component, ElementRef, inject, Input, NgZone, OnChanges, OnDestroy, OnInit } from '@angular/core';

import { Flight } from '../../entities/flight';

@Component({
  selector: 'app-flight-card',
  templateUrl: './flight-card.component.html',
  styleUrls: ['./flight-card.component.css']
})
export class FlightCardComponent implements OnInit, OnChanges, OnDestroy {
  debug = true;

  @Input({ required: true }) item!: Flight;
  @Input() isSelected = false;

  private readonly elementRef = inject(ElementRef);
  private readonly ngZone = inject(NgZone);

  constructor() {
    if (this.debug) {
      console.warn('[FlightCardComponent - constructor()]');
      console.log(this.item);
      console.log('isSelected: ' + this.isSelected);
    }
  }

  ngOnChanges(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnChanges()]');
      console.log(this.item);
      console.log('isSelected: ' + this.isSelected);
    }
  }

  ngOnInit(): void {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnInit()]');
      console.log(this.item);
      console.log('isSelected: ' + this.isSelected);
    }
  }

  ngOnDestroy() {
    if (this.debug) {
      console.warn('[FlightCardComponent - ngOnDestroy()]');
      console.log(this.item);
      console.log('isSelected: ' + this.isSelected);
    }
  }

  blink(): void {
    // Dirty Hack used to visualize the change detector
    // let originalColor = this.elementRef.nativeElement.firstChild.style.backgroundColor;
    this.elementRef.nativeElement.firstChild.style.backgroundColor = 'crimson';
    //              ^----- DOM-Element

    this.ngZone.runOutsideAngular(() => {
      setTimeout(() => {
        this.elementRef.nativeElement.firstChild.style.backgroundColor = '';
      }, 1000);
    });
  }
}
