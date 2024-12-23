import { Timestamp } from 'firebase/firestore';

export interface Post {
  id?: string;
  title: string;
  image?: string;
  date: Timestamp | Date;
  body: string;
}
