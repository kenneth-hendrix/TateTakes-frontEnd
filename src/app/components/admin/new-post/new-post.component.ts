import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FeedService } from '../../../services/feed.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DraftsService } from '../../../services/drafts.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule, TextFieldModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  postForm: FormGroup;

  private fb = inject(FormBuilder);
  private feedService = inject(FeedService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);
  private draftsService = inject(DraftsService);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      image: [''],
      body: ['', [Validators.required]],
    });
  }

  submitNewPost() {
    if (this.postForm.valid) {
      this.spinner.show();
      const { title, image, body } = this.postForm.value;
      const formattedText = body.replace(/\n/g, '<br>');
      this.feedService
        .newPost(title, formattedText, image || '')
        .then(() => {
          this.postForm.reset();
          this.toastr.success(
            `Your post, ${title}, has been published successfully`,
            'Success',
          );
        })
        .catch((error) => {
          console.error(error);
          this.toastr.error('Please try again later', 'Something went wrong');
        })
        .finally(() => {
          this.spinner.hide();
        });
    }
  }

  saveDraft(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.spinner.show();
    const { title, image, body } = this.postForm.value;
    const formattedText = body.replace(/\n/g, '<br>');
    this.draftsService
      .newDraft(title, formattedText, image || '')
      .then(() => {
        this.postForm.reset();
        this.toastr.success(`Your draft was saved successfully`, 'Success');
        this.draftsService.draftCreated();
      })
      .catch((error) => {
        console.error(error);
        this.toastr.error('Please try again later', 'Something went wrong');
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  get isValidDraft(): boolean {
    const { title, image, body } = this.postForm.value;
    return title || image || body;
  }
}
