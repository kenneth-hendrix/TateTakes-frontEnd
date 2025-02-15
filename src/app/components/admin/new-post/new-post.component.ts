import { Component, inject, OnInit } from '@angular/core';
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
export class NewPostComponent implements OnInit {
  postForm: FormGroup;
  draftId = '';
  autosaveText = 'Post not saved!';
  autosaving = false;

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

  ngOnInit() {
    setInterval(() => {
      if (this.isValidDraft) {
        this.autosaveText = 'Saving...';
        const { title, image, body } = this.postForm.value;
        const formattedText = body.replace(/\n/g, '<br>');
        this.autosaving = true;
        if (this.draftId === '') {
          this.draftsService
            .newDraft(title, formattedText, image)
            .then((docRef) => {
              this.draftId = docRef.id;
              const currentTime = new Date().toLocaleTimeString();
              this.autosaveText = `Last saved at ${currentTime}`;
              this.draftsService.draftCreated();
              this.autosaving = false;
            });
        } else {
          const post = {
            title: title,
            image: image,
            body: formattedText,
            date: new Date(),
          };
          this.draftsService.updateDraft(this.draftId, post).then(() => {
            const currentTime = new Date().toLocaleTimeString();
            this.autosaveText = `Last saved at ${currentTime}`;
            this.autosaving = false;
          });
        }
      }
    }, 30000);
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
          this.draftsService.deleteDraft(this.draftId).then(() => {
            this.autosaveText = 'Post not saved!';
          });
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
