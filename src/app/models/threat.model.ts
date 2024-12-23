import { Timestamp } from 'firebase/firestore';

export interface Threat {
  id?: string;
  date: Timestamp | Date;
  message: string;
}
