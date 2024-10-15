import { Injectable } from '@angular/core';
import { Threat } from '../models/threat.model';
import { addDoc, collection, Firestore, orderBy, query } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collectionData } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DeathThreatService {
  constructor(private firestore: Firestore) {}

  newThreat(message: string): Promise<any> {
    const postsRef = collection(this.firestore, 'threats');
    let threat: Threat = {
      message: message,
      date: new Date(),
    };
    return addDoc(postsRef, threat);
  }

  getThreats(): Observable<Threat[]> {
    const postsRef = collection(this.firestore, 'threats');
    const sortedQuery = query(postsRef, orderBy('date', 'desc'));
    return collectionData(sortedQuery, { idField: 'id' }) as Observable<Threat[]>;
  }
}
