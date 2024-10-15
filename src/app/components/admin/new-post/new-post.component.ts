import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedService } from '../../../services/feed.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';

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

  constructor() {
    this.postForm = this.fb.group({
      title: ['', [Validators.required]],
      body: ['', [Validators.required]],
    });
  }

  submitNewPost() {
    if (this.postForm.valid) {
      this.spinner.show();
      const { title, body } = this.postForm.value;
      const formattedText = body.replace(/\n/g, '<br>');
      this.feedService
        .newPost(title, formattedText)
        .then(() => {
          this.spinner.hide();
          this.postForm.reset();
          this.toastr.success(
            `Your post, ${title}, has been published succesfully`,
            'Success'
          );
        })
        .catch((error) => {
          this.spinner.hide();
          console.error(error);
          this.toastr.error('Please try again later', 'Something went wrong');
        });
    }
  }
}
