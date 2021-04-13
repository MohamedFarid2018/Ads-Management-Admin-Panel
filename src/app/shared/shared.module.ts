import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExportAsModule } from 'ngx-export-as';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule, } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbdSortableHeader } from '../directives/sortable.directive';
import { InternationalPhoneNumberModule } from 'ngx-international-phone-number';
import {NgxPrintModule} from 'ngx-print';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { MyHttpInterceptor } from "../../app/common/interceptor/my-http-interceptor";


@NgModule({
  declarations: [NgbdSortableHeader],
  imports: [
    NgbModule,
    NzTagModule,
    FormsModule,
    CommonModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
    NzRadioModule,
    NzEmptyModule,
    NzModalModule,
    NzInputModule,
    NzUploadModule,
    ExportAsModule,
    NzButtonModule,
    NzSelectModule,
    NgxChartsModule,
    NzDividerModule,
    NzMessageModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzPopconfirmModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NzDescriptionsModule,
    InternationalPhoneNumberModule,
    HttpClientModule,
    NzResultModule,
    NgxPrintModule,
    BsDatepickerModule.forRoot(),
  ],
  exports: [
    NgbModule,
    NzTagModule,
    FormsModule,
    CommonModule,
    NzFormModule,
    NzGridModule,
    NzIconModule,
    NzCardModule,
    NzSpaceModule,
    NzTableModule,
    NzRadioModule,
    NzEmptyModule,
    NzModalModule,
    NzInputModule,
    ExportAsModule,
    NzButtonModule,
    NzUploadModule,
    NzSelectModule,
    NgxChartsModule,
    NzDividerModule,
    NzMessageModule,
    NzCheckboxModule,
    NzDropDownModule,
    NzPopconfirmModule,
    NzTimePickerModule,
    NzDatePickerModule,
    NzInputNumberModule,
    ReactiveFormsModule,
    NgxIntlTelInputModule,
    NzDescriptionsModule,
    InternationalPhoneNumberModule,
    NgbdSortableHeader,
    NzResultModule,
    NgxPrintModule,
    BsDatepickerModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: MyHttpInterceptor,
      multi: true
    },
    DatePipe
  ]
})

export class SharedModule { }
