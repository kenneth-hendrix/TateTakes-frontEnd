import { inject, Injectable } from '@angular/core';
import {
  addDoc,
  collectionData,
  deleteDoc,
  doc,
  Firestore,
  orderBy,
  query,
  updateDoc,
} from '@angular/fire/firestore';
import { firstValueFrom, Observable, Subject } from 'rxjs';
import { Post } from '../models/post.model';
import { collection } from '@firebase/firestore';

@Injectable({
  providedIn: 'root',
})
export class DraftsService {
  private firestore = inject(Firestore);
  private _draftCreated = new Subject<void>();
  $draftCreated = this._draftCreated.asObservable();

  getDrafts(): Promise<Post[]> {
    const postsRef = collection(this.firestore, 'drafts');
    const sortedQuery = query(postsRef, orderBy('date', 'desc'));
    return firstValueFrom(
      collectionData(sortedQuery, { idField: 'id' }) as Observable<Post[]>,
    );
  }

  newDraft(title: string, body: string, image = '') {
    const postsRef = collection(this.firestore, 'drafts');
    const post: Post = {
      title: title,
      image: image,
      body: body,
      date: new Date(),
    };
    return addDoc(postsRef, post);
  }

  updateDraft(id: string, draft: Post) {
    const postDocRef = doc(this.firestore, `drafts/${id}`);
    return updateDoc(postDocRef, {
      title: draft.title,
      body: draft.body,
      image: draft.image,
      date: draft.date || new Date(),
    });
  }

  deleteDraft(id: string) {
    const postDocRef = doc(this.firestore, `drafts/${id}`);
    return deleteDoc(postDocRef);
  }

  draftCreated() {
    this._draftCreated.next();
  }
}
