import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-category-add',
  templateUrl: './category-add.component.html',
  styleUrls: ['./category-add.component.scss'],
})
export class CategoryAddComponent implements OnInit {
  isVisible = false;
  addCategoryForm!: FormGroup;
  mobileValidationError: string;
  @Output() categoryModalShow: EventEmitter<any> = new EventEmitter();
  @Output() categoryAdded: EventEmitter<any> = new EventEmitter();
  fileToUpload: File = null;
  separateDialCode = false;
  files = [];
  images = [];
  uploading = false;
  facilitesList: any;
  previewImage: string | undefined = '';
  previewVisible = false;
  today: Date = new Date()

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private categoriesService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.buildAddCategoryForm();
    this.isVisible = true;
  }

  buildAddCategoryForm() {
    this.addCategoryForm = this.fb.group({
      name: ['', Validators.required],
    });
  }

  handleOk(): void {
    const data = this.addCategoryForm.value;
    if (this.addCategoryForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000,
      });
      return;
    }

    const body: any = {
      name: data.name,
    };

    this.categoriesService.addCategory(body).subscribe(
      response => {
        this.isVisible = false;
        this.categoryAdded.emit(true);
        this.categoryModalShow.emit(true);
        this.message.success('Category added successfully', {
          nzDuration: 3000,
        });
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
    this.categoryModalShow.emit(true);

    this.isVisible = false;
  }

  log(e) {}
}
