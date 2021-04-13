import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth.service';
import { WatchStorageService } from '../../services/watchstorage.service';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AdminsService } from '../../services/admins.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  isAuth: boolean;
  isLoading: boolean;
  loginForm: FormGroup;
  resetForm: FormGroup;
  notFound: boolean;
  showForgetPasswordForm: boolean;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private auth: AuthService,
    private message: NzMessageService,
    private adminService: AdminsService,
    private watchStorage: WatchStorageService
  ) {}

  ngOnInit(): void {
    this.isAuth = !!localStorage.getItem('token');
    this.watchStorage.watchStorage().subscribe((res) => {
      this.isAuth = !!localStorage.getItem('token');
    });
    this.loginForm = this.fb.group({
      emailOrPhone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      from: ['dashboard'],
    });
    this.resetForm = this.fb.group({
      resetemail: [
        '',
        [
          Validators.required,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
    });
  }
  submitForm(): void {
    this.isLoading = true;
    const data = this.loginForm.value;
    if (!data.emailOrPhone) {
      this.message.error('Please enter your email or phone!', {
        nzDuration: 3000,
      });
      this.isLoading = false;
      return;
    } else if (!data.password) {
      this.message.error('Please enter your password!', {
        nzDuration: 3000,
      });
      this.isLoading = false;
      return;
    }

    this.auth.login(this.loginForm.value).subscribe(
      (response) => {
        if (response.roles && !response.roles.includes('user')) {
          this.message.success('Signed in successfully', {
            nzDuration: 3000,
          });
          this.watchStorage.setItem('token', response.token);
          this.router.navigate(['/configurations']);
          this.isLoading = false;
        } else {
          this.message.error("This Admin Doesn't exist", {
            nzDuration: 3000,
          });
          this.isLoading = false;
          return;
        }
      },
      (error) => {
        this.isLoading = false;
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
  sentResetLink() {
    this.message.success('check your email', {
      nzDuration: 3000,
      nzAnimate: true,
    });
    this.showForgetPasswordForm = false;
  }

  checkEmailIfExist() {
    this.notFound = false;
    if (
      this.resetForm.get('resetemail').value &&
      this.resetForm.get('resetemail').valid
    ) {
      this.adminService
        .listAdmins(0, 10, {
          'where[email]': this.resetForm.get('resetemail').value,
        })
        .subscribe((response) => {
          if (response.admins && !response.admins.length) {
            this.notFound = true;
          } else {
            this.notFound = false;
          }
        });
    }
  }
}
