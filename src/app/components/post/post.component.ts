import { Component, Input } from '@angular/core';
import { Post } from '../../models/post.model';
import { CommentsComponent } from "../comments/comments.component";
import { TimestampToDatePipe } from '../../pipes/timestamp-to-date.pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommentsComponent, TimestampToDatePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.scss',
})
export class PostComponent {
  @Input({ required: true }) post!: Post;
}
