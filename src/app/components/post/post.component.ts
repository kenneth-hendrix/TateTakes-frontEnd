import { Component, inject, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { CommentsComponent } from "../comments/comments.component";
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommentsComponent, TimestampToDatePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input({ required: true }) post!: Post;

  private toastr = inject(ToastrService);

  showComments() {
    this.toastr.info('Comments are still in development', 'Coming Soon');
  }
}
