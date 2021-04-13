import { NzMessageService } from 'ng-zorro-antd/message';
import { TagsService } from '../../services/tags.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-tags-add',
  templateUrl: './tag-add.component.html',
  styleUrls: ['./tag-add.component.scss']
})
export class TagsAddComponent implements OnInit {
  isVisible = false;
  addTagForm!: FormGroup;
  mobileValidationError: string;
  @Output() tagModalShow: EventEmitter<any> = new EventEmitter();
  @Output() tagAdded: EventEmitter<any> = new EventEmitter();

  separateDialCode = false;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Egypt, CountryISO.SaudiArabia];

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private tagService: TagsService,
  ) { }
  
  ngOnInit(): void {
    // just for now
    this.buildAddTagForm();
    this.isVisible = true;
  }
  buildAddTagForm() {
    this.addTagForm = this.fb.group({
      name: [null, Validators.required],
    });
  }

  handleOk(): void {
    if (this.addTagForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000
      });
      return;
    }
    const body = this.addTagForm.value;
    this.tagService.addTag(body).subscribe(
      response => {
        if (response._id) {
          this.isVisible = false;
          this.tagModalShow.emit(true);
          this.tagAdded.emit(true);
          this.message.success('Tag added successfully', {
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
    this.tagModalShow.emit(true);

    this.isVisible = false;
  }
}
