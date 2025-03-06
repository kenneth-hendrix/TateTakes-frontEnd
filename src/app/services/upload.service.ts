import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  private http = inject(HttpClient);

  uploadImages(image: File) {
    const formData = new FormData();
    formData.append('image', image);

    if (!environment.production) {
      return this.http.post<{ success: boolean; imageUrl: string }>(
        'http://localhost:3000/api/upload-image',
        formData,
      );
    } else {
      return this.http.post<{ success: boolean; imageUrl: string }>(
        '/api/upload-image',
        formData,
      );
    }
  }
}
