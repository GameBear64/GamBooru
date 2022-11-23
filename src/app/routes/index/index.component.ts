import { Component, OnInit } from '@angular/core';
import { IndexService } from './index.service';
@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
  constructor(private indexService: IndexService) {}

  count = 0;

  ngOnInit(): void {
    this.indexService.getCount().subscribe((data) => (this.count = data.count));
  }
}
