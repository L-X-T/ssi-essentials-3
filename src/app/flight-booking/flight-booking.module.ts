import { NgModule } from '@angular/core';

import { SharedModule } from '../shared/shared.module';
import { FlightSearchComponent } from './flight-search/flight-search.component';
import { FlightCardComponent } from './flight-card/flight-card.component';
import { FlightStatusToggleComponent } from './flight-status-toggle/flight-status-toggle.component';
import { FlightValidationErrorsComponent } from './flight-validation-errors/flight-validation-errors.component';

@NgModule({
  imports: [SharedModule],
  declarations: [FlightSearchComponent, FlightCardComponent, FlightStatusToggleComponent, FlightValidationErrorsComponent],
  exports: [FlightSearchComponent]
})
export class FlightBookingModule {}
