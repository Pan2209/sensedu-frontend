import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = 'http://localhost:3000'; // tu backend

  constructor(private http: HttpClient) {}

  // ================= USERS =================

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  createUser(name: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/users`, { name });
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/users/${id}`);
  }

  // ================= SESSIONS =================

  createSession(userId: number): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/sessions/${userId}`, {});
  }

  // ================= ATTEMPTS =================

  createAttempt(
    sessionId: number,
    letter: string,
    correct: boolean,
    timeSpent: number
  ): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/attempts`, {
      sessionId,
      letter,
      correct,
      timeSpent
    });
  }

 sendLetter(letter: string): Observable<any> {
  return this.http.get<any>(`${this.baseUrl}/esp32/${letter}`);
}


  getStatsByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/sessions/stats/${userId}`);
  }
}
