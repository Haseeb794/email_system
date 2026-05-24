import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Subscriber, CreateSubscriberDto } from '../models/subscriber.model';

@Injectable({
  providedIn: 'root',
})
export class SubscriberService {
  private readonly apiBase = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Subscriber[]> {
    return this.http
      .get<Subscriber[]>(`${this.apiBase}/subscribers`)
      .pipe(catchError(this.handleError));
  }

  create(payload: CreateSubscriberDto): Observable<Subscriber> {
    return this.http
      .post<Subscriber>(`${this.apiBase}/subscribers`, payload)
      .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiBase}/subscribers/${id}`)
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    const message = error.error?.detail ?? error.message ?? 'An unexpected error occurred';
    return throwError(() => ({ status: error.status, message }));
  }
}
