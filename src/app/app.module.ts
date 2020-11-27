//modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// database
import { NewsDatabase } from './components/shared/news.database';

// components
import { AppComponent } from './app.component';
import { ApiComponent } from './components/api/api.component';
import { CountriesComponent } from './components/countries/countries.component';
import { ResultsComponent } from './components/results/results.component';

const ROUTES = [
  { path: '', component: ApiComponent },
  { path: 'countries', component: CountriesComponent },
  { path: 'results', component: ResultsComponent },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    AppComponent,
    ApiComponent,
    CountriesComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(ROUTES),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [NewsDatabase],
  bootstrap: [AppComponent],
})
export class AppModule {}
