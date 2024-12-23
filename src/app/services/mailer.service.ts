import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MailerService {
  private http = inject(HttpClient);

  addSubscriber(email: string) {
    const body = { email };
    if (!environment.production) {
      return this.http.post('http://localhost:3000/api/subscriber', body);
    } else {
      return this.http.post('/api/subscriber', body);
    }
  }
}
