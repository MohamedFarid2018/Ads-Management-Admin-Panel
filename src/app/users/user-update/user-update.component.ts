import { NzMessageService } from 'ng-zorro-antd/message';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-users-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UsersUpdateComponent implements OnInit {
  @Input() user;
  isVisible = false;
  updateUserForm!: FormGroup;
  mobileValidationError: string;
  @Output() userModalShow: EventEmitter<any> = new EventEmitter();
  @Output() userUpdated: EventEmitter<any> = new EventEmitter();

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Egypt, CountryISO.SaudiArabia];
  parserPercent = (value: string) => value.replace(' %', '');
  formatterPercent = (value: number) => `${value} %`;
  categories: any = [];
  areas: any = [];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private userService: UsersService,
  ) { }
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }


  ngOnInit(): void {
    if (this.user) {
      this.buildUpdateUserForm(this.user);
    }
    this.isVisible = true;
  }

  buildUpdateUserForm(user?) {
    let phone = user && user.phone || '';
    if (user && user.phone && user.phone.indexOf('+2') === 0) {
      phone = user.phone.substring(2);
    }

    this.updateUserForm = this.fb.group({
      name: [user && user.name || '', Validators.required],
      email: [user && user.email || '', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.required]],
      phone: [phone, Validators.required],
    });
  }

  mobileChange() {
    if (this.updateUserForm.get('phone').value && !this.updateUserForm.get('phone').value.length) {
      this.mobileValidationError = 'Please input user Mobile Number!';
    }
    if (this.updateUserForm.get('phone').value.length && this.updateUserForm.get('phone').invalid) {
      this.mobileValidationError = 'Mobile Number Invalid!';
    }
    if (this.updateUserForm.get('phone') &&
      !this.updateUserForm.get('phone').value.length &&
      this.updateUserForm.get('phone').valid) {
      this.mobileValidationError = null;
    }

  }
  
  handleOk(): void {
    if (this.updateUserForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000
      });
      return;
    }
    
    const body = {
      email: this.updateUserForm.value.email,
      name: this.updateUserForm.value.name,
      phone: this.updateUserForm.value.phone.e164Number,
    };
    
    this.userService.updateUser(this.user._id, body).subscribe(
      response => {
        if (response._id) {
          this.isVisible = false;
          this.userModalShow.emit(true);
          this.userUpdated.emit(true);
          this.message.success('User updated successfully', {
            nzDuration: 3000
          });
        } else {
          this.message.error('try again!', {
            nzDuration: 3000
          });
        }
      }, 
      error => {
        const err = error && error.error && error.error.arMessage ? error.error.arMessage : 'حدث خطأ ما'
        this.message.error(err, {
          nzDuration: 3000
        });
      }
    );
  }

  handleCancel(): void {
    this.userModalShow.emit(true);

    this.isVisible = false;
  }
}
