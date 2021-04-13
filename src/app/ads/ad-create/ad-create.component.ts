import { NzMessageService } from 'ng-zorro-antd/message';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO,
} from 'ngx-intl-tel-input';
import { UploadService } from '../../services/upload.service';
import { NzUploadFile, NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { AdsService } from '../../services/ads.service';
import { UsersService } from '../../services/users.service';
import { TagsService } from '../../services/tags.service';
import { CategoriesService } from '../../services/categories.service';
import differenceInCalendarDays from 'date-fns/differenceInCalendarDays';

function getBase64(file: File): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

@Component({
  selector: 'app-ad-create',
  templateUrl: './ad-create.component.html',
  styleUrls: ['./ad-create.component.scss'],
})
export class AdCreateComponent implements OnInit {
  @Output() adModalShow: EventEmitter<any> = new EventEmitter();
  @Output() adAdded: EventEmitter<any> = new EventEmitter();

  isVisible = false;
  addAdForm!: FormGroup;
  mobileValidationError: string;
  mobileValidationErrorForEmployee = [];
  fileToUpload: File = null;
  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Egypt, CountryISO.SaudiArabia];
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  files = [];
  body: any = {};
  uploading = false;
  fileList: NzUploadFile[] = [];
  images: any = [];
  previewImage: string | undefined = '';
  previewVisible = false;
  users: any = [];
  queries: any = [];
  categories: any = [];
  tags: any = [];
  isLoading = false;
  isSearching = false;
  types: any = [
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' },
  ];
  oldSearchValue: any = '';
  today: Date = new Date();

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private uploadService: UploadService,
    private adsService: AdsService,
    private userService: UsersService,
    private tagsService: TagsService,
    private categoriesService: CategoriesService
  ) {}

  // beforeUpload = (file: NzUploadFile): boolean => {
  //   this.fileList = [];
  //   this.fileList = this.fileList.concat(file);
  //   return false;
  // }
  beforeUpload = (file: NzUploadFile): boolean => {
    this.images.push(file);
    return true;
  };
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  ngOnInit(): void {
    this.buildAddAdForm();
    this.getCategories();
    this.getTags();
    this.listUsers();
    this.isVisible = true;
  }

  disabledDate = (current: Date): boolean => {
    // Can not select days before today and today
    return differenceInCalendarDays(current, this.today) < 0;
  };

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

  buildAddAdForm() {
    this.addAdForm = this.fb.group({
      type: ['', Validators.required],
      title: ['', Validators.required],
      description: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      category: ['', Validators.required],
      advertiser: ['', Validators.required],
      tags: [[], Validators.required],
    });
  }

  onSearch(value: string): void {
    if (value || value !== this.oldSearchValue) {
      setTimeout(() => {
        this.users = [];
        this.oldSearchValue = value;
        this.isLoading = true;
        this.queries['name'] = value;
        this.listUsers();
      }, 100);
    }
  }

  listUsers() {
    setTimeout(() => {
      if (!this.isSearching) {
        this.isSearching = true;
        this.users = [];
        this.userService.listAllUsers(this.queries).subscribe((response) => {
          if (response.users && response.users.length) {
            this.isLoading = false;
            this.isSearching = false;
            response.users.forEach((user, index) => {
              this.users.push({
                ...user,
                totalCount: response.total,
              });
            });
          } else {
            this.users = [];
            this.isLoading = false;
            this.isSearching = false;
          }
        });
      }
    }, 500);
  }

  handleOk(): void {
    // console.log(this.addAdForm.value);
    const data = this.addAdForm.value;

    if (this.addAdForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000,
      });
      return;
    }
    if (new Date(data.startDate).getTime() > new Date(data.endDate).getTime()) {
      this.message.error('Ad end date should be bigger than start date', {
        nzDuration: 3000,
      });
      return;
    }
    const body = data;
    body.startDate = new Date(body.startDate).toJSON().split('T')[0];
    body.endDate = new Date(body.endDate).toJSON().split('T')[0];
    const formData = new FormData();
    formData.append('data', JSON.stringify(body));
    if (this.images.length) {
      this.images.forEach((file: any, i) => {
        const index = this.fileList.findIndex((x) => x.uid === file.uid);
        if (index >= 0) {
          formData.append('image', file);
          this.createAd(formData);
        }
      });
    } else {
      this.createAd(body);
    }
  }

  createAd(body) {
    this.adsService.createAd(body).subscribe(
      (response) => {
        if (response) {
          this.isVisible = false;
          this.adAdded.emit(true);
          this.adModalShow.emit(true);
          this.message.success('Ad created successfully', {
            nzDuration: 3000,
          });
        }
      },
      (error) => {
        const err =
          error && error.error && error.error.arMessage
            ? error.error.arMessage
            : 'حدث خطأ ما';
        this.message.error(err, {
          nzDuration: 3000,
        });
      }
    );
  }

  handleCancel(): void {
    this.adModalShow.emit(true);
    this.isVisible = false;
  }

  log(e) {}

  handlePreview = async (file: NzUploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    this.previewImage = file.url || file.preview;
    this.previewVisible = true;
  };

  handleChange(info: NzUploadChangeParam): void {
    let fileList = [...info.fileList];
    this.fileList = [];
    fileList.map((file) => {
      file.status = 'done';
    });
    this.fileList = fileList;
  }
}
