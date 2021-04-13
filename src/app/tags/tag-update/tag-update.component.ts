import { NzMessageService } from 'ng-zorro-antd/message';
import { TagsService } from '../../services/tags.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
@Component({
  selector: 'app-tags-update',
  templateUrl: './tag-update.component.html',
  styleUrls: ['./tag-update.component.scss']
})
export class TagsUpdateComponent implements OnInit {
  @Input() tag;
  isVisible = false;
  updateTagForm!: FormGroup;
  mobileValidationError: string;
  @Output() tagModalShow: EventEmitter<any> = new EventEmitter();
  @Output() tagUpdated: EventEmitter<any> = new EventEmitter();

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
    if (this.tag) {
      this.buildUpdateTagForm(this.tag);
    }
    this.isVisible = true;
  }
  buildUpdateTagForm(pack?) {
    this.updateTagForm = this.fb.group({
      name: [pack && pack.name || '', Validators.required],
    });
  }

  handleOk(): void {
    if (this.updateTagForm.invalid) {
      this.message.error('Please add All required fields', {
        nzDuration: 3000
      });
      return;
    }
    const body = this.updateTagForm.value;
    this.tagService.updateTag(this.tag._id, body).subscribe(
      response => {
        if (response._id) {
          this.isVisible = false;
          this.tagModalShow.emit(true);
          this.tagUpdated.emit(true);
          this.message.success('Tag updated Successfully', {
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
