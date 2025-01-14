import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizServiceService {

  private quizData = 'assets/data/quiz.json'; 

  constructor(private http: HttpClient) { }

  getRandomQuiz(): Observable<any> {
    return new Observable(observer => {
      this.http.get<any[]>(this.quizData).subscribe(
        quizzes => {
          const randomIndex = Math.floor(Math.random() * quizzes.length);  
          const randomQuiz = quizzes[randomIndex];
          observer.next(randomQuiz);
          observer.complete();
        },
        error => {
          observer.error('Error al cargar los datos del quiz');
        }
      );
    });
  }
}
