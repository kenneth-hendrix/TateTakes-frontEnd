import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedService } from '../../../services/feed.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-post',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './new-post.component.html',
  styleUrl: './new-post.component.scss',
})
export class NewPostComponent {
  postForm: FormGroup;

  private fb = inject(FormBuilder);
  private feedService = inject(FeedService);
  private toastr = inject(ToastrService);

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
    });
  }

  submitNewPost() {
    if (this.postForm.valid) {
      const { title, body } = this.postForm.value;
      this.feedService.newPost(title, body).then(() => {
        this.postForm.reset();
        this.toastr.success(`Your post, ${title}, has been published succesfully`, 'Success');
      }).catch(error => {
        console.error(error);
        this.toastr.error('Please try again later', 'Something went wrong');
      });
    }
  }
}
