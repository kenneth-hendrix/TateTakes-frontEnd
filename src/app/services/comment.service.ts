import { Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { Comments } from '../models/comments.model';

@Injectable({
  providedIn: 'root',
})
export class CommentService {
  constructor(private firestore: Firestore) {}

  getComments(parent: string): Observable<Comments[]> {
    const postsRef = collection(this.firestore, `posts/${parent}/comments`);
    const sortedQuery = query(postsRef, orderBy('date', 'desc'));
    return collectionData(sortedQuery, { idField: 'id' }) as Observable<Comments[]>;
  }

  newComment(author: string, body: string, parent: string): Promise<any> {
    const postsRef = collection(this.firestore, `posts/${parent}/comments`);
    let comment: Comments = {
      author: author,
      body: body,
      date: new Date(),
    };
    return addDoc(postsRef, comment);
  }
}
