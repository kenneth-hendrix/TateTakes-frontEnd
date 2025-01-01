import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextFieldModule } from '@angular/cdk/text-field';
import { DraftsService } from '../../../services/drafts.service';
import { FeedService } from '../../../services/feed.service';
import { Post } from '../../../models/post.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';
import { TimestampToDatePipe } from '../../../pipes/timestamp-to-date.pipe';

@Component({
  selector: 'app-drafts',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TextFieldModule,
    ReactiveFormsModule,
    TimestampToDatePipe,
  ],
  templateUrl: './drafts.component.html',
  styleUrl: './drafts.component.scss',
})
export class DraftsComponent implements OnInit, OnDestroy {
  private draftService = inject(DraftsService);
  private fb = inject(FormBuilder);
  private feedService = inject(FeedService);
  private spinner = inject(NgxSpinnerService);
  private toastr = inject(ToastrService);

  drafts: Post[] = [];
  currentDraft: Post | undefined;
  draftForm: FormGroup;

  private $destroy = new Subject<void>();

  constructor() {
    this.draftForm = this.fb.group({
      title: ['', [Validators.required]],
      image: [''],
      body: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.getDrafts();
    this.draftService.$draftCreated
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getDrafts();
      });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  getDrafts() {
    this.spinner.show();
    this.draftService
      .getDrafts()
      .then((drafts) => {
        this.drafts = drafts;
      })
      .catch((err) => {
        console.error(err);
        this.toastr.error('Please try again later', 'Something went wrong');
      })
      .finally(() => {
        this.spinner.hide();
      });
  }

  openDraft(draft: Post) {
    this.currentDraft = draft;
    this.draftForm.get('title')?.setValue(draft.title);
    this.draftForm
      .get('body')
      ?.setValue(draft.body.replace(/<br\s*\/?>/gi, '\n'));
    this.draftForm.get('image')?.setValue(draft.image);
  }

  closeDraft() {
    this.currentDraft = undefined;
  }

  goBack(): void {
    this.closeDraft();
  }

  submitEditDraft() {
    if (this.draftForm.valid && this.currentDraft?.id) {
      this.spinner.show();
      const { title, image, body } = this.draftForm.value;
      const formattedText: string = body.replace(/\n/g, '<br>');
      const post: Post = {
        title: title,
        body: formattedText,
        image: image,
        date: new Date(),
      };
      this.draftService
        .updateDraft(this.currentDraft.id, post)
        .then(() => {
          this.toastr.success('Successfully saved draft', 'Success');
        })
        .catch((err) => {
          console.error(err);
          this.toastr.error(
            'Please try deleting again later',
            'Draft published, but could not be deleted',
          );
        })
        .finally(() => {
          this.closeDraft();
          this.getDrafts();
        });
    }
  }

  isDraftValid(): boolean {
    const { title, image, body } = this.draftForm.value;
    return title || body || image;
  }

  publishDraft(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (this.draftForm.valid && this.currentDraft?.id) {
      this.spinner.show();
      const { title, image, body } = this.draftForm.value;
      const formattedText = body.replace(/\n/g, '<br>');
      this.feedService
        .newPost(title, formattedText, image)
        .then(() => {
          if (this.currentDraft?.id) {
            this.draftService
              .deleteDraft(this.currentDraft.id)
              .then(() => {
                this.toastr.success('Successfully published draft', 'Success');
              })
              .catch((err) => {
                this.spinner.hide();
                console.error(err);
                this.toastr.error(
                  'Please try deleting again later',
                  'Draft published, but could not be deleted',
                );
              })
              .finally(() => {
                this.closeDraft();
                this.getDrafts();
              });
          }
        })
        .catch((err) => {
          this.spinner.hide();
          console.error(err);
          this.toastr.error('Please try again later', 'Something went wrong');
        });
    }
  }

  deleteDraft() {
    if (this.currentDraft?.id) {
      this.spinner.show();
      this.draftService
        .deleteDraft(this.currentDraft.id)
        .then(() => {
          this.toastr.success('Successfully deleted draft', 'Success');
          this.closeDraft();
          this.getDrafts();
        })
        .catch((err) => {
          this.spinner.hide();
          console.error(err);
          this.toastr.error('Please try again later', 'Something went wrong');
        });
    }
  }
}
