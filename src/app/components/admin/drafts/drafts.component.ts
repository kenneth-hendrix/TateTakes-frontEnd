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
  private draftsService = inject(DraftsService);
  private fb = inject(FormBuilder);
  private feedService = inject(FeedService);
  private spinner = inject(NgxSpinnerService);
  private toastr = inject(ToastrService);

  drafts: Post[] = [];
  currentDraft: Post | undefined;
  draftForm: FormGroup;
  autosaveText = 'Draft Saved';
  autosaving = false;

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
    this.draftsService.$draftCreated
      .pipe(takeUntil(this.$destroy))
      .subscribe(() => {
        this.getDrafts();
      });

    setInterval(() => {
      if (this.isDraftValid() && this.currentDraft) {
        this.autosaveText = 'Saving...';
        const { title, image, body } = this.draftForm.value;
        const formattedText = body.replace(/\n/g, '<br>');
        if (this.currentDraft?.id) {
          const post = {
            title: title,
            image: image,
            body: formattedText,
            date: new Date(),
          };
          this.autosaving = true;
          this.draftsService
            .updateDraft(this.currentDraft.id, post)
            .then(() => {
              this.autosaving = false;
              const currentTime = new Date().toLocaleTimeString();
              this.autosaveText = `Last saved at ${currentTime}`;
            });
        }
      }
    }, 30000);
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  getDrafts() {
    this.spinner.show();
    this.draftsService
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
      this.draftsService
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
            this.draftsService
              .deleteDraft(this.currentDraft.id)
              .then(() => {
                this.toastr.success('Successfully published draft', 'Success');
                this.autosaveText = 'Draft Saved';
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
      this.draftsService
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
