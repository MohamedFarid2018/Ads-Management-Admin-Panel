import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TagsService } from '../../services/tags.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { GenralTableService } from '../../services/table/genral.tabel.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdSortableHeader } from '../../directives/sortable.directive';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-tags-list',
  templateUrl: './tags-list.component.html',
  styleUrls: ['./tags-list.component.scss'],
  providers: [GenralTableService, DecimalPipe]

})
export class TagsListComponent implements OnInit {
  config: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'exportingTable'
  };
  addTag = false;
  tagsList: any = [];
  sort: any;
  filter: any;
  currenRolePermission: any = [];

  tags$: any;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  updateTag: boolean;
  selectedTag: any;

  page = 0;
  searchTerm = new FormControl();
  queries = {};
  pagesCount: number;
  exporting = false;
  tagsToExport: any;
  constructor(
    private modal: NzModalService,
    private tagService: TagsService,
    public service: GenralTableService,
    private exportAsService: ExportAsService,
    private nzMessageService: NzMessageService
  ) {
    this.tags$ = service.general$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.listTags();
    this.search();
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.exporting = true;
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.tagService.listAllTags().subscribe(
      response => {
        this.exporting = false;
        this.tagsToExport = response;
        const checkExist = setInterval(() => {
          const idname = document.getElementById('exportingTable');
          if (idname) {
            clearInterval(checkExist);
            this.exportAsService.save(this.config, 'myFile').subscribe((res) => {
              // save started
              this.tagsToExport = null;
            });
          }
        }, 100);
        this.nzMessageService.success('Exported');
      }, err => {
        this.exporting = false;
        this.nzMessageService.error('can not download file');
      }
    );
  }

  listTags() {
    const limit = this.service.pageSize;
    const page = this.service.page;
    this.tagService.listTags(page, limit, this.queries).subscribe(
      response => {
        if (response.tags && response.tags.length) {
          this.tagsList = [];
          response.tags.forEach((p, index) => {
            this.tagsList.push(
              {
                ...p,
                totalCount: response.length
              }
            );
          });
        } else {
          this.tagsList = [];
        }
        this.service.saveData(this.tagsList);
        this.pagesCount = Math.ceil(response.length / limit) || 1;
      }
    );
  }

  showModal(action, p?): void {
    switch (action) {
      case 'add':
        this.addTag = true;
        break;
      case 'update':
        this.updateTag = true;
        this.selectedTag = p;
        break;
    }
  }

  tagModalShow(e) {
    if (e) {
      this.addTag = false;
    }
  }

  updateTagModalShow(e) {
    if (e) {
      this.updateTag = false;
    }
  }

  loadTags(e) {
    if (!e) {
      return;
    }
    this.listTags();
  }

  showEditConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to update these user?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => console.log('OK')
    });
  }

  deletetag(p) {
    this.tagService.deleteTag(p._id).subscribe(
      response => {
        if (response) {
          this.nzMessageService.success('tag deleted successfully!');
          this.listTags();
        }
      }
    );
  }

  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this user?',
      nzContent: '<b style="color: #ff0000;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => console.log('OK'),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel')
    });
  }

  onSort({ column, direction }) {
    // resetting other headers
    this.headers.forEach(header => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }
  arrayOne(n: number): any[] {
    return Array(n);
  }
  search() {
    this.searchTerm.valueChanges.pipe(
      debounceTime(500)
    ).subscribe(response => {
      if (response) {
        this.queries['name'] = response;
        this.queries['email'] = response;
        this.queries['phone'] = response;
        this.listTags();
      } else {
        this.queries = {};
        this.listTags();
      }
    });
  }
  pagination(page) {
    if (this.service.page === page) {
      return;
    }
    this.service.page = page;
    this.listTags();
  }
  changeItemsPerPage() {
    this.service.page = 1;
    this.tagsList = [];
    this.listTags();
  }

}
