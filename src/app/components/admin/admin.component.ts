import { Component, inject } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FeedService } from '../../services/feed.service';
import { NewPostComponent } from "./new-post/new-post.component";
import { EditPostComponent } from "./edit-post/edit-post.component";
import { DeletePostComponent } from "./delete-post/delete-post.component";
import { ViewThreatsComponent } from "./view-threats/view-threats.component";
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    HeaderComponent,
    ReactiveFormsModule,
    NewPostComponent,
    EditPostComponent,
    DeletePostComponent,
    ViewThreatsComponent,
    MatTabsModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  newPostOpen: boolean = false;
  editOpen: boolean = false;
  deleteOpen: boolean = false;
  threatsOpen: boolean = false;

  toggleNewPost() {
    this.newPostOpen = !this.newPostOpen;
  }

  toggleEdit() {
    this.editOpen = !this.editOpen;
  }

  toggleDelete() {
    this.deleteOpen = !this.deleteOpen;
  }

  toggleThreats() {
    this.threatsOpen = !this.threatsOpen;
  }
}
