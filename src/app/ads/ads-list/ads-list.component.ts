import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import {
  ExportAsService,
  ExportAsConfig,
  SupportedExtensions,
} from 'ngx-export-as';
import { GenralTableService } from '../../services/table/genral.tabel.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdSortableHeader } from '../../directives/sortable.directive';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { AdsService } from '../../services/ads.service';
import { UsersService } from '../../services/users.service';
import { TagsService } from '../../services/tags.service';
import { CategoriesService } from '../../services/categories.service';

@Component({
  selector: 'app-ads-list',
  templateUrl: './ads-list.component.html',
  styleUrls: ['./ads-list.component.scss'],
  providers: [GenralTableService, DecimalPipe],
})
export class AdsListComponent implements OnInit {
  config: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'exportingTable',
  };
  addAd = false;
  adsList: any = [];
  adsToExport: any = [];
  sort: any;
  filter: any;
  currenRolePermission: any = [];

  ads$: any;
  total$: Observable<number>;

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  updateAd: boolean;
  selectedAd: any;

  page = 0;
  searchTerm = new FormControl();
  queries = {};
  pagesCount: number;
  exporting: boolean;
  dateToExport: any;
  currentSpoc: any;
  currentClients: any = [];
  users: any = [];
  selectedUser: any = "";
  categories: any = [];
  selectedCategory: any = "";
  tags: any = [];
  selectedTag: any = "";

  constructor(
    private modal: NzModalService,
    public service: GenralTableService,
    private exportAsService: ExportAsService,
    private nzMessageService: NzMessageService,
    private adsService: AdsService,
    private userService: UsersService,
    private tagsService: TagsService,
    private categoriesService: CategoriesService,
  ) {
    this.ads$ = service.general$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.getCategories();
    this.getTags();
    this.getUsers();
    this.listAds();
    this.search();
  }

  getCategories() {
    this.categoriesService.listAllCategories().subscribe((response) => {
      if (response.length) {
        this.categories = response;
      }
    });
  }

  getTags() {
    this.tagsService.listAllTags().subscribe((response) => {
      if (response.length) {
        this.tags = response;
      }
    });
  }

  getUsers() {
    this.userService.listAllUsers({}).subscribe((response) => {
      if (response.length) {
        this.users = response.users;
      }
    });
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.exporting = true;
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.adsService.listAllAds().subscribe(
      (response) => {
        this.exporting = false;
        if (response.length) {
          for (let i = 0; i < response.length; i++) {
            const ad = response[i];
            this.adsToExport.push({
              ...ad,
            });
          }
          setTimeout(() => {
            this.dateToExport = this.adsToExport;
            const checkExist = setInterval(() => {
              const idname = document.getElementById('exportingTable');
              if (idname) {
                clearInterval(checkExist);
                this.exportAsService
                  .save(this.config, 'myFile')
                  .subscribe((res) => {
                    // save started
                    this.dateToExport = null;
                  });
              }
            }, 100);
          }, 1000)

          this.nzMessageService.success('Exported');
        }
      },
      (err) => {
        this.exporting = false;
        this.nzMessageService.error('can not download file');
      }
    );
  }

  listAds() {
    const limit = this.service.pageSize;
    const page = this.service.page;
    const query = {
      category: this.selectedCategory ? this.selectedCategory : "",
      tags: this.selectedTag ? this.selectedTag : "",
      advertiser: this.selectedUser ? this.selectedUser : "",
    };

    this.adsService
      .lisAds(page, limit, {...query, ...this.queries})
      .subscribe(async (response) => {
        if (response.ads.length) {
          this.adsList = [];
          for (let i = 0; i < response.ads.length; i++) {
            const ad = response.ads[i];
            this.adsList.push({
              ...ad,
              totalCount: response.length,
            });
          }
        } else {
          this.adsList = [];
        }
        this.service.saveData(this.adsList);
        this.pagesCount = Math.ceil(response.length / limit) || 1;
      });
  }

  getAdTags(adTags){
    const tags = adTags.map((t) => t.name || '')
    return tags.join(",");
  }

  getAdDate(date){
    return new Date(date).toLocaleDateString();
  }

  showModal(action, ad?): void {
    switch (action) {
      case 'add':
        this.addAd = true;
        break;
      case 'update':
        this.updateAd = true;
        this.selectedAd = ad;
        break;
    }
  }

  adModalShow(e) {
    if (e) {
      this.addAd = false;
    }
  }

  updateAdModalShow(e) {
    if (e) {
      this.updateAd = false;
    }
  }

  loadAds(e) {
    if (!e) {
      return;
    }
    this.adsList = [];
    this.listAds();
  }

  showEditConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to update this ad?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => console.log('OK'),
    });
  }

  deleteAd(ad) {
    this.adsService.deleteAd(ad._id).subscribe((response) => {
      if (response) {
        this.adsList = [];
        this.listAds();
        this.nzMessageService.success('Ad Deleted successfully', {
          nzDuration: 3000,
        });
      } else {
        this.nzMessageService.error('Can not delete Ad', {
          nzDuration: 3000,
        });
      }
    });
  }
  cancel(): void {
    // this.nzMessageService.info('click cancel');
  }

  showDeleteConfirm(): void {
    this.modal.confirm({
      nzTitle: 'Are you sure delete this Ad?',
      nzContent: '<b style="color: #ff0000;">Some descriptions</b>',
      nzOkText: 'Yes',
      nzOkType: 'danger',
      nzOnOk: () => console.log('OK'),
      nzCancelText: 'No',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  onSort({ column, direction }) {
    // resetting other headers
    this.headers.forEach((header) => {
      if (header.sortable !== column) {
        header.direction = '';
      }
    });

    this.service.sortColumn = column;
    this.service.sortDirection = direction;
  }

  search() {
    this.searchTerm.valueChanges
      .pipe(debounceTime(500))
      .subscribe((response) => {
        if (response) {
          this.queries['title'] = response;
          this.listAds();
        } else {
          this.queries = {};
          this.listAds();
        }
      });
  }
  arrayOne(n: number): any[] {
    return Array(n);
  }

  pagination(page) {
    if (this.service.page === page) {
      return;
    }
    this.service.page = page;
    this.listAds();
  }

  changeItemsPerPage() {
    this.service.page = 1;
    this.adsList = [];
    this.listAds();
  }
}
