import { NzMessageService } from 'ng-zorro-antd/message';
import { CategoriesService } from '../../services/categories.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  Input,
  ElementRef,
  ViewChild,
} from '@angular/core';

@Component({
  selector: 'app-category-update',
  templateUrl: './category-update.component.html',
  styleUrls: ['./category-update.component.scss'],
})
export class CategoryUpdateComponent implements OnInit {
  isVisible = false;
  updateCategoryForm!: FormGroup;
  mobileValidationError: string;
  fileToUpload: File = null;
  separateDialCode = false;
  files = [];
  images = [];
  newImages = [];
  uploading = false;
  formData = new FormData()
  @Input() category;
  @Output() categoryModalShow: EventEmitter<any> = new EventEmitter();
  @Output() categoryUpdated: EventEmitter<any> = new EventEmitter();
  previewImage: string | undefined = '';
  previewVisible: any = false;
  today: Date = new Date()

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private categoriesService: CategoriesService,
  ) {}
  
  ngOnInit(): void {
    if (this.category) {
      this.buildupdateCategoryForm(this.category);
      this.isVisible = true;
    }
  }
  buildupdateCategoryForm(category) {
    const fixedCategory = Object.assign(
      {
        name: '',
      },
      category
    );

    this.updateCategoryForm = this.fb.group({
      name: [fixedCategory.name, Validators.required],
    });
  }

  handleOk(): void {
    const data = this.updateCategoryForm.value;
    if (this.updateCategoryForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000,
      });
      return;
    }
    const body: any = {
      name: data.name,
    };

    this.categoriesService.updateCategory(this.category._id, body).subscribe(
      (response) => {
        if (response._id) {
          this.isVisible = false;
          this.categoryUpdated.emit(true);
          this.categoryModalShow.emit(true);
        } else {
          this.message.error('Can not update category!', {
            nzDuration: 3000,
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
    this.categoryModalShow.emit(true);

    this.isVisible = false;
  }
  log(e) {}
}
