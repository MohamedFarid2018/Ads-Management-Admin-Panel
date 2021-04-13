import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TagsService } from '../../services/tags.service';
@Component({
  selector: 'app-tag-view',
  templateUrl: './tag-view.component.html',
  styleUrls: ['./tag-view.component.scss']
})
export class TagViewComponent implements OnInit {
  tag: any;
  tagId: any;
  constructor(
    private activeRoute: ActivatedRoute,
    private tagService: TagsService
  ) { }

  ngOnInit(): void {
    this.tagId = this.activeRoute.snapshot.params.id;
    if (this.tagId) {
      this.viewTag();
    }
  }
  viewTag() {
    this.tagService.viewTag(this.tagId).subscribe(
      response => {
        if (response.tag) {
          this.tag = response.tag;
        }
      }
    );
  }
}
