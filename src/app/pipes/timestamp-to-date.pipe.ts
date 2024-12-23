import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from 'firebase/firestore';

@Pipe({
  name: 'timestampToDate',
  standalone: true,
})
export class TimestampToDatePipe implements PipeTransform {
  transform(value: Timestamp | Date, format = 'default'): string {
    let date: Date;
    if (value instanceof Timestamp) {
      date = value.toDate();
    } else {
      date = value;
    }

    switch (format) {
      case 'default':
        return date.toLocaleString();
      case 'date-only':
        return date.toDateString();
      case 'iso':
        return date.toISOString();
      default:
        return date.toLocaleString();
    }
  }
}
