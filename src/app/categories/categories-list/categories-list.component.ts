import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesService } from '../../services/categories.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { GenralTableService } from '../../services/table/genral.tabel.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdSortableHeader } from '../../directives/sortable.directive';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss'],
  providers: [GenralTableService, DecimalPipe]

})
export class CategoriesListComponent implements OnInit {
  config: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'exportingTable'
  };
  addCategory = false;
  categoriesList: any = [];
  sort: any;
  filter: any;
  currenRolePermission: any = [];

  categories$: any;
  total$: Observable<number>;
  firstName = new FormControl();
  lastName = new FormControl();
  email = new FormControl();
  phone = new FormControl();

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  updateCategory: boolean;
  selectedCategory: any;

  page = 0;
  searchTerm = new FormControl();
  queries = {};
  pagesCount: number;
  exporting = false;
  categoriesToExport: any;
  constructor(
    private modal: NzModalService,
    private categoryService: CategoriesService,
    public service: GenralTableService,
    private exportAsService: ExportAsService,
    private nzMessageService: NzMessageService
  ) {
    this.categories$ = service.general$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.listCategories();
    this.search();
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.exporting = true;
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.categoryService.listAllCategories().subscribe(
      response => {
        this.exporting = false;
        if (response && response.categories) {
          this.categoriesToExport = response.categories;
          setTimeout(()=>{
            const checkExist = setInterval(() => {
              const idname = document.getElementById('exportingTable');
              if (idname) {
                clearInterval(checkExist);
                this.exportAsService.save(this.config, 'myFile').subscribe((res) => {
                  // save started
                  this.categoriesToExport = null;
                });
              }
            }, 100);
  
            this.nzMessageService.success('Exported');
          }, 1500)
        }
      }, err => {
        this.exporting = false;
        this.nzMessageService.error('can not download file');
      }
    );
  }

  listCategories() {
    const limit = this.service.pageSize;
    const page = this.service.page;
    this.categoryService.listCategories(page, limit, this.queries).subscribe(
      response => {
        if (response.categories && response.categories.length) {
          this.categoriesList = [];
          response.categories.forEach((category, index) => {
            this.categoriesList.push(
              {
                ...category,
                totalCount: response.length
              }
            );
          });
        } else {
          this.categoriesList = [];
        }
        this.service.saveData(this.categoriesList);
        this.pagesCount = Math.ceil(response.length / limit) || 1;
      }
    );
  }

  showModal(action, category?): void {
    switch (action) {
      case 'add':
        this.addCategory = true;
        break;
      case 'update':
        this.updateCategory = true;
        this.selectedCategory = category;
        break;
    }
  }

  categoryModalShow(e) {
    if (e) {
      this.addCategory = false;
    }
  }

  updateCategoryModalShow(e) {
    if (e) {
      this.updateCategory = false;
    }
  }

  loadCategories(e) {
    if (!e) {
      return;
    }
    this.listCategories();
  }

  showEditConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to update these user?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => console.log('OK')
    });
  }

  deleteCategory(category) {
    this.categoryService.deleteCategory(category._id).subscribe(
      response => {
        if (response) {
          this.nzMessageService.success('category deleted successfully!');
          this.listCategories();
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
        this.queries['arName'] = response;
        this.listCategories();
      } else {
        this.queries = {};
        this.listCategories();
      }
    });
  }
  pagination(page) {
    if (this.service.page === page) {
      return;
    }
    this.service.page = page;
    this.listCategories();
  }
  changeItemsPerPage() {
    this.service.page = 1;
    this.categoriesList = [];
    this.listCategories();
  }

}
