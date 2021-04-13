import { NzMessageService } from 'ng-zorro-antd/message';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, ElementRef, ViewChild, Input } from '@angular/core';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
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
    reader.onerror = error => reject(error);
  });
}

@Component({
  selector: 'app-ad-update',
  templateUrl: './ad-update.component.html',
  styleUrls: ['./ad-update.component.scss']
})
export class AdUpdateComponent implements OnInit {
  @Output() adModalShow: EventEmitter<any> = new EventEmitter();
  @Output() adUpdated: EventEmitter<any> = new EventEmitter();

  isVisible = false;
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
  newImages:any = [];
  body: any = {};
  oldSpoc: any = {};
  oldClients: any = [];
  uploading = false;
  fileList: NzUploadFile[] = [];
  images : any = [];
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
    private categoriesService: CategoriesService,
  ) { }
  @Input() ad;
  updateAdForm!: FormGroup;

  // beforeUpload = (file: NzUploadFile): boolean => {
  //   this.fileList = []
  //   this.fileList = this.fileList.concat(file);
  //   return false;
  // }
  beforeUpload = (file: NzUploadFile): boolean => {
    this.images.push(file);
    return true;
  }

  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  ngOnInit(): void {
    if (this.ad) {
    this.getCategories();
    this.getTags();
    this.listUsers();
      this.buildUpdateAdForm();
    }
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
  buildUpdateAdForm() {
    this.updateAdForm = this.fb.group({
      type: [this.ad ? this.ad.type : '', Validators.required],
      title: [this.ad ? this.ad.title : '', Validators.required],
      description: [this.ad ? this.ad.description : '', Validators.required],
      image: [this.ad ? [this.ad.image] : [], Validators.required],
      startDate: [this.ad ? this.ad.startDate : null, Validators.required],
      endDate: [this.ad ? this.ad.endDate : null, Validators.required],
      category: [this.ad && this.ad.category ? this.ad.category._id : '', Validators.required],
      advertiser: [this.ad && this.ad.advertiser ? this.ad.advertiser._id : '', Validators.required],
      tags: [[], Validators.required],
    });
    const adTags = this.ad && this.ad.tags ? this.ad.tags.map((t) => t._id) : [];
    this.updateAdForm.get("tags").setValue(adTags);
    if(this.ad.image) {
      const str = String(this.ad.image).split('.com/');
      this.fileList.push({
        uid: '0',
        name: `[${str[str.length - 1]}].png`,
        status: 'done',
        url: this.ad.image,
      });
    }
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
    fileList.map(file => {
      file.status = 'done';
    });
    this.fileList = fileList;
  }

  handleOk(): void {
    if (this.updateAdForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000
      });
      return;
    }
    const data = this.updateAdForm.value;
    const body = data;
    body.startDate = new Date(body.startDate).toJSON().split('T')[0];
    body.endDate = new Date(body.endDate).toJSON().split('T')[0];
    if (new Date(data.startDate).getTime() > new Date(data.endDate).getTime()) {
      this.message.error(
        'Ad end date should be bigger than start date',
        {
          nzDuration: 3000,
        }
      );
      return;
    }
    if(this.images.length) {
      this.images.forEach((file: any, i) => {
        const index = this.fileList.findIndex(x => x.uid === file.uid);
        if(index >= 0) {
          if (!file.url) {
            const formData = new FormData();
            formData.append('image', file);
            formData.append("data", JSON.stringify(this.body));
            this.uploading = true;
            this.updateAd(formData, this.ad._id);
          }    
        }
      });
    } else {
      this.body.image = data.image[0] || '';
      this.updateAd(this.body, this.ad._id);
    }
  }

  updateAd(body, id){
    this.adsService.updatAd(body, id).subscribe(
      response => {
        if (response) {
          this.isVisible = false;
          this.adUpdated.emit(true);
          this.adModalShow.emit(true);
          this.message.success('Ad updated successfully', {
            nzDuration: 3000
          });
        }
      },
      error => {
        const err = error && error.error && error.error.arMessage ? error.error.arMessage : 'حدث خطأ ما'
        this.message.error(err, {
          nzDuration: 3000
        });
      },
    ); 
  }


  handleCancel(): void {
    this.adModalShow.emit(true);
    this.isVisible = false;
  }

  log(e) {
  }
}