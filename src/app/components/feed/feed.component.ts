import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FeedService } from '../../services/feed.service';
import { BehaviorSubject, Subject, take, takeUntil, timeout } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostComponent } from '../post/post.component';
import { AuthService } from '../../services/authentication.service';
import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { ExpandedPostComponent } from "../post/expanded-post/expanded-post.component";

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [HeaderComponent, PostComponent, NgxSpinnerComponent, ExpandedPostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit, OnDestroy {
  private feedService = inject(FeedService);
  private authService = inject(AuthService);
  private spinner = inject(NgxSpinnerService);

  private $destroy = new Subject<void>();

  feed: Post[] = [];
  buttonType: 'none' | 'login' | 'logout' = 'login';
  somethingWentWrong: boolean = false;
  loading: boolean = false;
  expandedPost: Post | undefined = undefined;
  expandedIndex: number = 0;

  ngOnInit(): void {
    this.spinner.show();
    this.authService.isAuthenticated
      .pipe(takeUntil(this.$destroy))
      .subscribe((value) => {
        if (value) {
          this.buttonType = 'logout';
        } else {
          this.buttonType = 'login';
        }
      });
    this.feedService
      .getFeed()
      .pipe(take(1))
      .subscribe({
        next: (response: Post[]) => {
          this.feed = response;
          this.spinner.hide();
        },
        error: (error) => {
          console.error(error);
          this.somethingWentWrong = true;
          this.spinner.hide();
        },
      });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  expandPost(post: Post, index: number): void {
    this.expandedIndex = index;
    this.expandedPost = post;
  }

  goBack() {
    this.expandedPost = undefined;
  }
}
