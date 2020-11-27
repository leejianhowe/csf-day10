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
  articles: NewsInfo[] = []
  name: string = ''
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private newsDatabase: NewsDatabase
  ) {}

  async ngOnInit(): Promise<void> {
    this.code = this.activatedRoute.snapshot.paramMap.get('code');
    console.log(this.code);
    this.results = await this.newsDatabase.getNews(this.code);
    // console.log('results comp', this.results)
    this.pushArticles()
    this.name = await this.newsDatabase.countryName(this.code)
  }
  
  saveArticle(index) {
    const id = this.results[index].id
    this.newsDatabase.saveArticle(id)
    
  }

  pushArticles() {
    for (let i = 0; i < this.results.length; i++) {
      let data = this.results[i].article
      // console.log(data)
      this.articles.push(data)
    }
  }
}
