import { Timestamp } from 'firebase/firestore';

export interface Comments {
  id?: string;
  author: string;
  body: string;
  date: Timestamp | Date;
}
