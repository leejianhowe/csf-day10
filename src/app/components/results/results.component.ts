import { Component, OnInit } from '@angular/core';
import { NewsDatabase } from '../shared/news.database';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CountryInfo, NewsInfo } from '../shared/model';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  code: string
  results: NewsInfo[]
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private newsDatabase: NewsDatabase
  ) {}

  async ngOnInit(): Promise<void> {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    console.log(this.code);
    this.results = await this.newsDatabase.getNews(this.code)

  }
}
