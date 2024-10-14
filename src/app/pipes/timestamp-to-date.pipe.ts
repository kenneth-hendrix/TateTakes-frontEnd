import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timestampToDate',
  standalone: true,
})
export class TimestampToDatePipe implements PipeTransform {
  transform(
    value: { seconds: number; nanoseconds: number },
    format: string = 'default'
  ): string {
    if (
      !value ||
      typeof value.seconds !== 'number' ||
      typeof value.nanoseconds !== 'number'
    ) {
      return '';
    }

    const milliseconds = value.seconds * 1000 + value.nanoseconds / 1000000;
    const date = new Date(milliseconds);

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
