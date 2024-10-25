import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';
import {
  Firestore,
  collectionData,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from '@angular/fire/firestore';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  constructor(private firestore: Firestore) {}

  getFeed(): Observable<Post[]> {
    const postsRef = collection(this.firestore, 'posts');
    const sortedQuery = query(postsRef, orderBy('date', 'desc'));
    return collectionData(sortedQuery, { idField: 'id' }) as Observable<Post[]>;
  }

  newPost(title: string, body: string, image = ""): Promise<any> {
    const postsRef = collection(this.firestore, 'posts');
    let post: Post = {
      title: title,
      image: image,
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
      image: post.image,
      date: post.date,
    });
  }

  deletePost(id: string) {
    const postDocRef = doc(this.firestore, `posts/${id}`);
    return deleteDoc(postDocRef);
  }
}
