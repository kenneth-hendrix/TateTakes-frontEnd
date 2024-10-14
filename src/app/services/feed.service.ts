import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Post } from '../models/post.model';
import {
  Firestore,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
} from '@angular/fire/firestore';
import { collection, DocumentData } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private firestore: Firestore) {}

  getFeed(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    return collectionData(postsRef, { idField: 'id' }) as Observable<Post[]>;
  }

  newPost(title: string, body: string): Promise<any> {
    const postsRef = collection(this.firestore, 'posts');
    let post: Post = {
      title: title,
      body: body,
      date: new Date(),
    };
    return addDoc(postsRef, post);
  }

  updatePost(id: string, post: Post) {
    const postDocRef = doc(this.firestore, `posts/${id}`);
    return updateDoc(postDocRef, {
      title: post.title,
      body: post.body,
      date: post.date,
    });
  }

  deletePost(id: string) {
    const postDocRef = doc(this.firestore, `posts/${id}`);
    return deleteDoc(postDocRef);
  }
}
