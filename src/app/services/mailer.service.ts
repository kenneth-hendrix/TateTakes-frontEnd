import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MailerService {
  constructor(private http: HttpClient) {}

  sendPing(): Observable<{ message: string }> {
    if (!environment.production) {
      return this.http.get('http://localhost:3000/api/ping') as Observable<{
        message: string;
      }>;
    } else {
      return this.http.get('/api/ping') as Observable<{ message: string }>;
    }
  }

  addSubscriber(email: string): Observable<any> {
    const body = { email };
    if (!environment.production) {
      return this.http.post('http://localhost:3000/api/subscriber', body);
    } else {
      return this.http.post(
        '/api/subscriber',
        body
      );
    }
  }

  sendMail(user: string): Observable<any> {
    let payload = { user };
    if (!environment.production) {
      payload.user = '1234'
      return this.http.post('http://localhost:3000/api/sendMail', payload);
    } else {
      return this.http.post('/api/sendMail', payload);
    }
  }
}
