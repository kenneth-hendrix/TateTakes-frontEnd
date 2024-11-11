import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedService } from '../../../services/feed.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { TextFieldModule } from '@angular/cdk/text-field';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { MailerService } from '../../../services/mailer.service';
import { take } from 'rxjs';

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
  private afAuth = inject(AngularFireAuth);
  private mailerService = inject(MailerService);

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
          this.spinner.hide();
          this.postForm.reset();
          this.sendEmail();
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

  sendEmail() {
    this.spinner.show();
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        const userId = user.uid;
        this.mailerService.sendMail(userId).pipe(take(1)).subscribe({
          next: () => {
            this.spinner.hide();
            this.toastr.success(
              `Emails sent successfully`,
              'Success'
            );
          },
          error: (err) => {
            this.spinner.hide();
            console.error(err);
            this.toastr.error('Please try again later', 'Something went wrong sending emails');
          }
        });
      } else {
        this.spinner.hide();
        this.toastr.error('Please try again later', 'Something went wrong sending emails');
      }
    });
  }
}
