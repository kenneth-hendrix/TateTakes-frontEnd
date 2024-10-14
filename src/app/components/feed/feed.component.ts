import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FeedService } from '../../services/feed.service';
import { BehaviorSubject, Subject, take, takeUntil } from 'rxjs';
import { Post } from '../../models/post.model';
import { PostComponent } from '../post/post.component';
import { AuthService } from '../../services/authentication.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [HeaderComponent, PostComponent],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit, OnDestroy {
  private feedService = inject(FeedService);
  private authService = inject(AuthService);

  private $destroy = new Subject<void>();

  feed: Post[] = [];
  buttonType: 'none' | 'login' | 'logout' = 'login';

  ngOnInit(): void {
    this.authService.isAuthenticated.pipe(takeUntil(this.$destroy)).subscribe((value) => {
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
        },
    });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }
}
