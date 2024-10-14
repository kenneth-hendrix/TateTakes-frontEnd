import { Component, inject, OnInit } from '@angular/core';
import { FeedService } from '../../../services/feed.service';
import { take } from 'rxjs';
import { Post } from '../../../models/post.model';
import { TimestampToDatePipe } from "../../../pipes/timestamp-to-date.pipe";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [TimestampToDatePipe, ReactiveFormsModule],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.scss',
})
export class EditPostComponent implements OnInit {
  private feedService = inject(FeedService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService);

  loading: boolean = false;
  posts: Post[] = [];
  selectedPost: Post | undefined = undefined;
  postForm: FormGroup;

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loading = true;
    this.feedService
      .getFeed()
      .pipe(take(1))
      .subscribe({
        next: (resp: Post[]) => {
          this.posts = resp;
          this.loading = false;
        },
        error: (error) => {
          this.loading = false;
          console.error(error);
          this.toastr.error('Please try again later', 'Something went wrong');
        },
      });
  }

  selectPost(post: Post): void {
    this.selectedPost = post;
    this.postForm.get('title')?.setValue(post.title);
    this.postForm.get('body')?.setValue(post.body);
  }

  submitEditPost() {
    if (this.postForm.valid && this.selectedPost?.id) {
      const { title, body } = this.postForm.value;
      let post: Post = {
        body: body,
        title: title,
        date: this.selectedPost?.date,
      }
      this.feedService.updatePost(this.selectedPost.id, post).then(() => {
        this.postForm.reset();
        this.posts.forEach(post => {
          if (post.id === this.selectedPost?.id) {
            post.body = body;
            post.title = title;
          }
        });
        this.selectedPost = undefined;
        this.toastr.success('Successfully edited post', 'Success');
      }).catch(error => {
        console.error(error);
        this.toastr.error('Please try again later', 'Something went wrong');
      });
    } else {
      console.error("Post has no ID");
      this.toastr.error('Please try again later', 'Something went wrong');
    }
  }
}
