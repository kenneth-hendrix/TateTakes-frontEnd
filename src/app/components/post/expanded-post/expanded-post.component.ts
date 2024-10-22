import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { TimestampToDatePipe } from "../../../pipes/timestamp-to-date.pipe";
import { Post } from '../../../models/post.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentService } from '../../../services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { Comments } from '../../../models/comments.model';
import { CommonModule } from '@angular/common';
import { TextFieldModule } from '@angular/cdk/text-field';

@Component({
  selector: 'app-expanded-post',
  standalone: true,
  imports: [
    TimestampToDatePipe,
    ReactiveFormsModule,
    CommonModule,
    TextFieldModule,
  ],
  templateUrl: './expanded-post.component.html',
  styleUrl: './expanded-post.component.scss',
})
export class ExpandedPostComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  @Input({ required: true }) index!: number;
  @Output() back = new EventEmitter<void>();

  commentForm: FormGroup;
  comments: Comments[] = [];
  colors: string[] = ['#BC4B51', '#5B8E7D', '#F4A259', '#8CB369'];

  private fb = inject(FormBuilder);
  private commentService = inject(CommentService);
  private toastr = inject(ToastrService);
  private spinner = inject(NgxSpinnerService);

  constructor() {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.maxLength(50)]],
      body: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    this.getComments();
    window.scrollTo(0,0);
  }

  submitNewComment() {
    if (this.commentForm.valid && this.post.id) {
      this.spinner.show();
      const { author, body } = this.commentForm.value;
      const formattedText = body.replace(/\n/g, '<br>');
      this.commentService
        .newComment(author, formattedText, this.post.id)
        .then(() => {
          this.spinner.hide();
          this.commentForm.reset();
          this.toastr.success(
            `Your comment has been published succesfully`,
            'Success'
          );
          this.getComments();
        })
        .catch((error) => {
          this.spinner.hide();
          console.error(error);
          this.toastr.error('Please try again later', 'Something went wrong');
        });
    }
  }

  goBack() {
    this.back.emit();
  }

  getComments() {
    this.spinner.show();
    if (this.post.id) {
      this.commentService.getComments(this.post.id).subscribe({
        next: (results) => {
          this.comments = results;
          this.spinner.hide();
        },
        error: (error) => {
          this.spinner.hide();
          console.error(error);
          this.toastr.error('Please try again later', 'Something went wrong');
        },
      });
    }
  }

  checkCharLimit(limit: number, control: string) {
    const bodyControl = this.commentForm.get(control);
    if (bodyControl && bodyControl.value.length > limit) {
      bodyControl.setValue(bodyControl.value.slice(0, limit)); // Trim the text to 50 characters
    }
  }
}
