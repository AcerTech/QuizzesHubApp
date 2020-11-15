import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AnimationController, Animation, ModalController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { Answer, Question, Quiz } from 'src/app/interfaces';
import { QuizSummaryComponent } from "../quiz-summary/quiz-summary.component";
import * as _ from "lodash";
import Speech from 'speak-tts'


@Component({
  selector: 'app-quiz-details',
  templateUrl: './quiz-details.page.html',
  styleUrls: ['./quiz-details.page.scss'],
})
export class QuizDetailsPage implements OnInit, AfterViewInit {
  quiz: Quiz
  questions: Question[] = []
  question: any = {}
  currentIndex: number = 0;
  selectedAnswers: Answer[] = []
  successMsgs: string[] = ['Awesome!', 'Great Job!', 'Amazing!', 'Super!', 'You ROCK!', 'Way to go!', 'Keep it up!', 'Oustanding!']
  wrongMsgs: string[] = ['Wrong', 'Focus', 'Try your best', 'Dont give up', 'Try better next time']
  quizResult: any = {}
  speech = new Speech() // will throw an exception if not browser supported
  isCorrect: boolean = true
  quizTitle: String = "";
  anim: Animation;
  disableSubmit: boolean = false;

  @ViewChild('questionContent', { static: false }) questionContent: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController,
    public toastController: ToastController) {

    if (this.router.getCurrentNavigation().extras.state) {
      this.quiz = this.router.getCurrentNavigation().extras.state.quiz;
      this.quizTitle = this.quiz['quiz']
      var _questions = this.quiz['questions']
      this.questions = _.orderBy(_questions, ['displayOrder'], ['asc'])
      // this.question =this.questions[0]
      this.question = this.questions[this.currentIndex]
    } else {
      this.router.navigate(['/'])
    }
  }

  ngAfterViewInit() {
    // this.anim = this.animationCtrl.create('myAnim');
    // this.anim
    //   .addElement(this.questionContent.nativeElement)
    //   .duration(1500)
    //   .easing('ease-out')
    //   .iterations(Infinity)
    this.anim = this.animationCtrl.create('myAnim')
      .addElement(document.querySelector('.questionContent'))
      .duration(1000)
      .direction('alternate')
      .iterations(1)
      .keyframes([
        { offset: 0, transform: 'scale(0)', opacity: '1' },//scale
        // { offset: 0, transform: 'scale(0) rotate(360deg)' }, //rotation 360

      ]);


  }



  ngOnInit() {
    this.selectedAnswers = []
  }

  async showModal() {
    const modal = await this.modalCtrl.create({
      component: QuizSummaryComponent,
      componentProps: {
        quizResult: "You finished the quiz"
      }
    })
    await modal.present();
  }

  clickSpeach(_text) {
    this.speech
      .speak({
        text: _text,
        // queue: false,
        // pitch: 1,
        // lang: 'en-GB',
        // splitSentences: true,
        // voice:'Google US English',
        // voice: { languageCode: 'en-US', ssmlGender: 'female' },
        listeners: {
          onstart: () => {
            // console.log("Start utterance");
          },
          onend: () => {
            // console.log("End utterance");
          },
          onresume: () => {
            // console.log("Resume utterance");
          },
          onboundary: event => {
            console.log(
              event.name +
              " boundary reached after " +
              event.elapsedTime +
              " milliseconds."
            );
          }
        }
      })
      .then(data => {
        console.log("Success !", data);
      })
      .catch(e => {
        console.error("An error occurred :", e);
      });
    // this.speech.setVoice('Fiona')
  }




  async submit() {
    this.disableSubmit = true;
    //TODO: save the answer somewhere
    var correctAnswers: [] = []
    correctAnswers = this.question.answers.filter((a) => a.isCorrect == true)
    this.isCorrect = _.isEqual(this.selectedAnswers, correctAnswers)
    if (this.isCorrect) {
      var audio = new Audio("assets/sound/Success.mp3");
      await audio.play();
    } else {
      var audio = new Audio("assets/sound/wrong.mp3");
      await audio.play();
    }
    this.presentToast()
    setTimeout(() => {
      if (!this.isCorrect) {
        return;
      }
      this.selectedAnswers = []
      this.MoveToNextQuestion()
    }, 1000);

  }

  moveNext() {
    this.isCorrect = true
    this.selectedAnswers = []
    this.MoveToNextQuestion()

  }
  async presentToast() {

    const toast = await this.toastController.create({
      message: this.isCorrect ? this.getSuccessMsg() : this.getWrongMsg(),
      duration: 700,
      position: 'middle',
      color: this.isCorrect ? "success" : "danger",
      // cssClass: 'toast_success'
    });
    toast.present();

  }

  getSuccessMsg() {
    return this.successMsgs[Math.floor(Math.random() * this.successMsgs.length)]
  }

  getWrongMsg() {
    return this.wrongMsgs[Math.floor(Math.random() * this.wrongMsgs.length)]
  }

  radioGroupAnswerChanged(_selectedAnswer) {
    this.selectedAnswers = []//because we need a single answer
    this.selectedAnswers.push(_selectedAnswer.detail.value)
    // console.log(_selectedAnswer.detail.value)
  }

  getCheckedvalue() {
    this.selectedAnswers = this.question.answers.filter(value => {
      return value.isChecked;
    });
    // console.log(this.selectedAnswers);
  }

  async MoveToNextQuestion() {
    this.disableSubmit = false;
    this.selectedAnswers = []
    this.currentIndex = this.currentIndex + 1
    if (this.currentIndex >= this.questions.length) {
      this.showModal();
      return
    }
    this.question = this.questions[this.currentIndex]
    // console.log(this.question)
    this.anim.play();
  }


  /*
  private int intIndex=-1;
          private void MoveNextQuestion()
          {
              DisableNextButton = false;
  
              intIndex++;
              if (intIndex <= QuestionsList.Count()-1)
              {
                  Question = QuestionsList[intIndex]; //picks list item
                  AnswersList = new ObservableCollection<Answer>(Question.answers as List<Answer>);
                  DisableNextButton = true;
              }
  
          }
  */


}
