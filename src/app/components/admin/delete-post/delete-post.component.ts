import { Component, inject, OnInit } from '@angular/core';
import { FeedService } from '../../../services/feed.service';
import { take } from 'rxjs';
import { Post } from '../../../models/post.model';
import { TimestampToDatePipe } from "../../../pipes/timestamp-to-date.pipe";
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-delete-post',
  standalone: true,
  imports: [TimestampToDatePipe],
  templateUrl: './delete-post.component.html',
  styleUrl: './delete-post.component.scss'
})
export class DeletePostComponent implements OnInit {
  private feedService = inject(FeedService);
  private toastr = inject(ToastrService);

  posts: Post[] = [];
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
        console.error(error);
        this.toastr.error('Please try again later', 'Something went wrong');
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
        this.toastr.success('Successfully deleted post', 'Success');
      }).catch((error) => {
        console.error(error);
        this.toastr.error('Please try again later', 'Something went wrong');
        this.loading = false;
        this.posts = temp;
      });
    } else {
      console.error('Post has no Id.');
      this.loading = false;
      this.toastr.error('Please try again later', 'Something went wrong');
    }
  }
}
