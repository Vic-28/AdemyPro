import { Component } from '@angular/core';
import { QuizServiceService } from '../../services/quiz-service.service';
import { Quiz } from '../../models/quiz';
import { Answer } from '../../models/answer';
@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {


  quiz: Quiz | undefined;
  answers:Answer[]=[]; ;

  constructor(private quizService:QuizServiceService) { }

  ngOnInit() {
    this.generateQuiz();
  }

  generateQuiz()
  {

  }

  clickAnswer() 
  {

  }

}
