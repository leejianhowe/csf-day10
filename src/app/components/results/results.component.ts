import { Component, OnInit } from '@angular/core';
import { NewsDatabase } from '../shared/news.database';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { CountryInfo, NewsInfo, NewsTable } from '../shared/model';
@Component({
  selector: 'app-results',
  templateUrl: './results.component.html',
  styleUrls: ['./results.component.css'],
})
export class ResultsComponent implements OnInit {
  code: string;
  results: NewsTable[];
  articles: NewsInfo[] = [];
  name: string = '';
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private newsDatabase: NewsDatabase
  ) {}

  async ngOnInit(): Promise<void> {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    console.log(this.code);
    this.results = await this.newsDatabase.getNews(this.code);
    console.log('results comp', this.results)
    await this.pushArticles();
    this.name = await this.newsDatabase.countryName(this.code);
  }

  async saveArticle(index) {
    const id = this.results[index].id;
    this.newsDatabase.saveArticle(id);
    this.results = await this.newsDatabase.getNews(this.code);
  }

  pushArticles() {
    // let counter = 0
    for (let i = 0; i < this.results.length; i++) {
      if (this.results[i].article != undefined) {
        let data = this.results[i].article;
        // counter++
        // console.log(counter)
        this.articles.push(data);
      }
    }
  }
}
