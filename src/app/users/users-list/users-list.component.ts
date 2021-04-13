import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { UsersService } from '../../services/users.service';
import { ExportAsService, ExportAsConfig, SupportedExtensions } from 'ngx-export-as';
import { GenralTableService } from '../../services/table/genral.tabel.service';
import { DecimalPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { NgbdSortableHeader } from '../../directives/sortable.directive';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss'],
  providers: [GenralTableService, DecimalPipe]

})
export class UsersListComponent implements OnInit {
  config: ExportAsConfig = {
    type: 'xlsx',
    elementIdOrContent: 'exportingTable'
  };
  addUser = false;
  usersList: any = [];
  sort: any;
  filter: any;
  currenRolePermission: any = [];

  users$: any;
  total$: Observable<number>;
  firstName = new FormControl();
  lastName = new FormControl();
  email = new FormControl();
  phone = new FormControl();

  @ViewChildren(NgbdSortableHeader) headers: QueryList<NgbdSortableHeader>;
  updateUser: boolean;
  selectedUser: any;

  page = 0;
  searchTerm = new FormControl();
  queries = {};
  pagesCount: number;
  exporting = false;
  usersToExport: any;
  constructor(
    private modal: NzModalService,
    private userService: UsersService,
    public service: GenralTableService,
    private exportAsService: ExportAsService,
    private nzMessageService: NzMessageService,
  ) {
    this.users$ = service.general$;
    this.total$ = service.total$;
  }

  ngOnInit(): void {
    this.listUsers();
    this.search();
  }

  exportAs(type: SupportedExtensions, opt?: string) {
    this.exporting = true;
    this.config.type = type;
    if (opt) {
      this.config.options.jsPDF.orientation = opt;
    }
    this.userService.listAllUsers(this.queries).subscribe(
      response => {
        this.exporting = false;
        if (response && response.users) {
          this.usersToExport = response.users;
          this.usersToExport.map((c, index) => {
            c.phone = String(c.phone).replace('+2', '').replace('+', '')
            if(String(c.phone).startsWith('20')) c.phone = String(c.phone).replace('20', '0')
          })
          setTimeout(()=>{
            const checkExist = setInterval(() => {
              const idname = document.getElementById('exportingTable');
              if (idname) {
                clearInterval(checkExist);
                this.exportAsService.save(this.config, 'myFile').subscribe((res) => {
                  // save started
                  this.usersToExport = null;
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

  listUsers() {
    const limit = this.service.pageSize;
    const page = this.service.page;
    this.userService.listUsers(page, limit, {...this.queries, role: 'user'}).subscribe(
      response => {
        if (response.users && response.users.length) {
          this.usersList = [];
          response.users.forEach((user, index) => {
            this.usersList.push(
              {
                ...user,
                totalCount: response.length
              }
            );
          });
        } else {
          this.usersList = [];
        }
        
        this.service.saveData(this.usersList);
        this.pagesCount = Math.ceil(response.length / limit) || 1;
      }
    );
  }

  showModal(action, user?): void {
    switch (action) {
      case 'add':
        this.addUser = true;
        break;
      case 'update':
        this.updateUser = true;
        this.selectedUser = user;
        break;
    }
  }

  userModalShow(e) {
    if (e) {
      this.addUser = false;
    }
  }

  updateUserModalShow(e) {
    if (e) {
      this.updateUser = false;
    }
  }

  loadUsers(e) {
    if (!e) {
      return;
    }
    this.listUsers();
  }

  showEditConfirm(): void {
    this.modal.confirm({
      nzTitle: '<i>Do you Want to update these user?</i>',
      nzContent: '<b>Some descriptions</b>',
      nzOnOk: () => console.log('OK')
    });
  }

  deleteuser(user) {
    this.userService.deleteUser(user._id).subscribe(
      response => {
        if (response) {
          this.nzMessageService.success('user deleted successfully!');
          this.listUsers();
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
        this.listUsers();
      } else {
        this.queries = {};
        this.listUsers();
      }
    });
  }
  pagination(page) {
    if (this.service.page === page) {
      return;
    }
    this.service.page = page;
    this.listUsers();
  }
  changeItemsPerPage() {
    this.service.page = 1;
    this.usersList = [];
    this.listUsers();
  }

}
