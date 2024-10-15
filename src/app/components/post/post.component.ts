import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
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
export class PostComponent implements OnInit {
  @Input({ required: true }) post!: Post;
  @Output() expandPost = new EventEmitter<void>();

  private toastr = inject(ToastrService);

  textToShow: string = "";

  ngOnInit(): void {
    if (this.post.body.length > 700) {
      this.textToShow = this.post.body.slice(0, 1500) + "...";
    } else {
      this.textToShow = this.post.body;
    }
  }

  showComments() {
    this.expandPost.emit();
  }

  expand() {
    this.expandPost.emit();
  }

}
