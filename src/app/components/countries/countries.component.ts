import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDatabase } from '../shared/news.database';
import { CountryInfo } from '../shared/model';
@Component({
  selector: 'app-countries',
  templateUrl: './countries.component.html',
  styleUrls: ['./countries.component.css'],
})
export class CountriesComponent implements OnInit {
  countryList: CountryInfo[];
  constructor(private router: Router, private newsDatabase: NewsDatabase) {}
  async ngOnInit(): Promise<void> {
    this.countryList = await this.newsDatabase.getCountries();
  }
  goSettings() {
    this.router.navigate(['/']);
  }

  goCountry(code:string) {
    this.router.navigate(['/results',code])
  }
}
