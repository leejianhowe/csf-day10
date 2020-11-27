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
  retrievedData: apiKey;
  form: FormGroup;
  constructor(
    private newsDataBase: NewsDatabase,
    private fb: FormBuilder,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.createForm();
    await this.getData();
  }
  createForm() {
    this.form = this.fb.group({
      apiKey: this.fb.control(this.apiKey, [Validators.required]),
    });
  }

  async getData() {
    this.retrievedData = await this.newsDataBase.getKey();
    console.log('retrieved', this.retrievedData);
    if (this.retrievedData == null) {
      return;
    } else {
      this.form.get('apiKey').setValue(this.retrievedData.apiKey);
    }
  }

  goCountries() {
    this.router.navigate(['/countries']);
  }

  add() {
    const apiKey = this.form.value as apiKey;
    if (this.retrievedData) {
      apiKey.id = this.retrievedData.id;
    } else {
      apiKey.id = 1;
    }
    console.log('apiKey', apiKey);
    this.newsDataBase.addKey(apiKey);
    this.goCountries();
  }
  delete() {
    const index = this.retrievedData.id;
    this.newsDataBase.deleteKey(index);
    this.retrievedData = null;
    this.form.get('apiKey').setValue('');
  }

  back() {
    this.form.reset();
    this.router.navigate(['/countries']);
  }
}
