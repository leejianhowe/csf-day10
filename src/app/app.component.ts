import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsDatabase } from './components/shared/news.database'
import { apiKey } from './components/shared/model';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  value:apiKey 
  title = 'newsApp';

  constructor(private newsDatabase:NewsDatabase, private router: Router) {
  }
  async ngOnInit() {
    this.value = await this.newsDatabase.getKey()
    this.value.apiKey
    if ( this.value.apiKey != '') {
      this.router.navigate(["/countries"])
    }
    
  }

}
