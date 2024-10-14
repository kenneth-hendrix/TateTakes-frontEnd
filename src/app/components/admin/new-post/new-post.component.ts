import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedService } from '../../../services/feed.service';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  postForm: FormGroup;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private feedService = inject(FeedService);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
    });
  }

  submitNewPost() {
    this.errorMessage = '';
    if (this.postForm.valid) {
      const { title, body } = this.postForm.value;
      this.feedService.newPost(title, body).then(() => {
        this.postForm.reset();
      });
    }
  }
}
