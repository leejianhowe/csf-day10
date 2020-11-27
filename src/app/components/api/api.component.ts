import { Component, OnInit } from '@angular/core';
import { NewsDatabase } from '../shared/news.database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { apiKey } from '../shared/model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-api',
  templateUrl: './api.component.html',
  styleUrls: ['./api.component.css'],
})
export class ApiComponent implements OnInit {
  apiKey: string;
  form: FormGroup;
  constructor(
    private newsDataBase: NewsDatabase,
    private fb: FormBuilder,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.form = this.fb.group({
      apiKey: this.fb.control(this.apiKey, [Validators.required]),
    });
    const retrieveKey = await this.newsDataBase.getKey();
    console.log(retrieveKey);
    if (retrieveKey > 0) {
      this.goCountries()
    }
  }

  goCountries() {
    this.router.navigate(['/countries']);
  }

  add() {
    const apiKey = this.form.value as apiKey;
    console.log('apiKey', apiKey);
    this.newsDataBase.addKey(apiKey);
    this.goCountries();
  }
}
