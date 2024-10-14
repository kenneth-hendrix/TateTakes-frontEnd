import { Component, inject, OnInit } from '@angular/core';
import { FeedService } from '../../../services/feed.service';
import { take } from 'rxjs';
import { Post } from '../../../models/post.model';
import { TimestampToDatePipe } from "../../../pipes/timestamp-to-date.pipe";

@Component({
  selector: 'app-delete-post',
  standalone: true,
  imports: [TimestampToDatePipe],
  templateUrl: './delete-post.component.html',
  styleUrl: './delete-post.component.scss'
})
export class DeletePostComponent implements OnInit {
  private feedService = inject(FeedService);

  posts: Post[] = [];
  errorMessage: string = '';
  loading: boolean = false;

  ngOnInit(): void {
    this.loading = true;
    this.feedService.getFeed().pipe(take(1)).subscribe({
      next: (resp: Post[]) => {
        this.posts = resp;
        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.message;
      }
    });
  }

  deletePost(id: string): void {
    this.loading = true;
    if (id) {
      let temp = [...this.posts];
      this.posts = this.posts.filter((post) => post.id !== id);
      this.feedService.deletePost(id).then(() => {
        this.loading = false;
      }).catch((error) => {
        console.log(error);
        this.loading = false;
        this.posts = temp;
      });
    } else {
      this.errorMessage = 'Post has no Id.';
      this.loading = false;
    }
  }
}
