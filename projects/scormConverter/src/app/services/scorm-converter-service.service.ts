import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})

export class ScormConverterService {

  private apiUrl = environment.apiUrl; // URL base de la API de Node.js

  constructor(private http: HttpClient) {}

  // Método para subir un archivo ZIP
  uploadFile(file: File): Observable<Blob> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this.http.post<Blob>(`${this.apiUrl}/upload`, formData, {
      headers: new HttpHeaders(),
      responseType: 'blob' as 'json' // Indicamos que esperamos un archivo (Blob) como respuesta
    });
  }
}
