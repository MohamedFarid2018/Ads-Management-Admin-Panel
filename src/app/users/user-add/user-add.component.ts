import { NzMessageService } from 'ng-zorro-antd/message';
import { UsersService } from '../../services/users.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  SearchCountryField,
  TooltipLabel,
  CountryISO,
} from 'ngx-intl-tel-input';

@Component({
  selector: 'app-users-add',
  templateUrl: './user-add.component.html',
  styleUrls: ['./user-add.component.scss'],
})
export class UsersAddComponent implements OnInit {
  isVisible = false;
  addUserForm!: FormGroup;
  mobileValidationError: string;
  @Output() userModalShow: EventEmitter<any> = new EventEmitter();
  @Output() userAdded: EventEmitter<any> = new EventEmitter();

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
    private userService: UsersService
  ) {}
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  ngOnInit(): void {
    // just for now
    this.buildAddUserForm();
    this.isVisible = true;
  }

  buildAddUserForm() {
    this.addUserForm = this.fb.group({
      name: ['', Validators.required],
      email: [
        '',
        [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'), Validators.required],
      ],
      phone: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  mobileChange() {
    if (
      this.addUserForm.get('phone').value &&
      !this.addUserForm.get('phone').value.length
    ) {
      this.mobileValidationError = 'Please input user Mobile Number!';
    }
    if (
      this.addUserForm.get('phone').value &&
      this.addUserForm.get('phone').value.length &&
      this.addUserForm.get('phone').invalid
    ) {
      this.mobileValidationError = 'Mobile Number Invalid!';
    }
  }

  handleOk(): void {
    if (this.addUserForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000,
      });
      return;
    }
    const body = {
      type: 'user',
      email: this.addUserForm.value.email,
      name: this.addUserForm.value.name,
      phone: this.addUserForm.value.phone.e164Number,
      password: this.addUserForm.value.password,
    };
    if (!body.email) delete body.email;
    this.userService.addUsers(body).subscribe(
      (response) => {
        if (response.id) {
          this.isVisible = false;
          this.userModalShow.emit(true);
          this.userAdded.emit(true);
          this.message.success('User added successfully', {
            nzDuration: 3000,
          });
        } else {
          this.message.error('try again!', {
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
    this.userModalShow.emit(true);

    this.isVisible = false;
  }
}
