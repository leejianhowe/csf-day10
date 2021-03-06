import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dexie } from 'dexie';
import { apiKey, CountryInfo, NewsInfo, NewsTable } from './model';
import { v4 as uuid } from 'uuid';
@Injectable()
export class NewsDatabase extends Dexie {
  countryList: string[];
  private apiKey: Dexie.Table<apiKey, number>;
  private country: Dexie.Table<CountryInfo, number>;
  private news: Dexie.Table<NewsTable, string>;
  constructor(private http: HttpClient) {
    // super call for extends Dexie name of db is searchDB
    super('newsDB');
    //setup schema for v1
    this.version(1).stores({
      apiKey: 'id',
      country: '++id',
      news: 'id,[country+save],country',
    });
    // this.search refer to the table
    this.apiKey = this.table('apiKey');
    this.country = this.table('country');
    this.news = this.table('news');
  }

  async saveArticle(id: string) {
    const article = await this.news.get(id);
    if (article.save == 0) article.save = 1;
    else {
      article.save = 0;
    }
    console.log('updated article', article);
    this.news.put(article);
  }

  //get country name
  async countryName(code: string) {
    const name = await this.country.toArray();
    const found = name.find((ele) => ele.code == code);
    return found.name;
  }

  // get news
  async getNews(code: string) {
    const apiKey = await this.apiKey.get(1);
    const timeNow = Date.now();
    console.log('timeNow', timeNow);
    const status = 0;
    const storedNews = await this.news
      .where('[country+save]')
      .equals([code, status])
      .toArray();
    console.log('stored', storedNews);
    const keys = [];
    const deleteNews = storedNews.map((ele) => {
      //   console.log(timeNow - ele.time);
      // 300000
      // articles more than 5mins
      if (timeNow - ele.time > 300000) {
        return ele;
      }
    });
    //cache false
    let counter = 0;
    // console.log('deleteNews', deleteNews.length);
    // if (deleteNews[0] == undefined) {

    // if cached true
    if (deleteNews.length != 0) {
      if (deleteNews[0] == undefined) counter = 1;
    }

    console.log('counter', counter);
    // cache true
    if (counter != 0) {
      console.log('news from db');
      const news = await this.news.where('country').equals(code).toArray();
      // only display news less than 5 mins
      const currentNews = [];
      for (let i = 0; i < news.length; i++) {
        if (news[i] != undefined) {
          if (timeNow - news[i].time < 300000) {
            currentNews.push(news[i]);
          }
        }
      }
      console.log('allNews', news.length);
      console.log('currentNews', currentNews.length);
      return currentNews;
      //cache false
    } else {
      if (deleteNews.length != 0) {
        const keysToDelete = deleteNews.map((ele) => ele.id);
        console.log(keysToDelete);
        await this.news.bulkDelete(keysToDelete);
      }
      const results = await this.http
        .get(
          `https://newsapi.org/v2/top-headlines?country=${code}&apiKey=${apiKey.apiKey}&pageSize=30`
        )
        .toPromise();
      // console.log('news results from API', results);
      const time = Date.now();
      const news: NewsTable[] = results['articles'].map((ele) => {
        const id = uuid();
        console.log(time);
        const x = {
          article: {
            source: ele.source.name,
            author: ele.author,
            title: ele.title,
            description: ele.description,
            url: ele.url,
            image: ele.urlToImage,
            date: ele.publishedAt,
            content: ele.content,
          },
          save: 0,
          id: id,
          country: code,
          time: time,
        };
        this.news.put(x);
        return x;
      });
      console.log('news from api', news);
      return news;
    }
  }
  // get country code from restcountries
  async getCountries() {
    const checkCountry = await this.country.count();
    console.log(checkCountry);
    if (checkCountry === 0) {
      const results = await this.http
        .get<any[]>(
          'https://restcountries.eu/rest/v2/alpha?codes=ae;ar;at;au;be;bg;br;ca;ch;cn;co;cu;cz;de;eg;fr;gb;gr;hk;hu;id;ie;il;in;it;jp;kr;lt;lv;ma;mx;my;ng;nl;no;nz;ph;pl;pt;ro;rs;ru;sa;se;sg;si;sk;th;tr;tw;ua;us;ve;za'
        )
        .toPromise();

      console.log('results from restcountries', results);
      const cc = results.map((ele) => {
        return {
          name: ele.name,
          code: ele.alpha2Code.toLowerCase(),
          flag: ele.flag,
        };
      });
      console.log('cc', cc);
      cc.forEach((ele) => {
        this.country.put(ele);
      });
      return cc;
    } else {
      console.log('results from db');
      return this.country.toArray();
    }
  }
  addKey(key: apiKey) {
    console.log(key);
    this.apiKey.put(key);
  }
  async getKey() {
    const counter = await this.apiKey.count();
    console.log('counter', counter);
    if (counter == 1) {
      return this.apiKey.get(1);
    } else {
      return null;
    }
  }

  deleteKey(index: number) {
    this.apiKey.delete(index);
  }
}
