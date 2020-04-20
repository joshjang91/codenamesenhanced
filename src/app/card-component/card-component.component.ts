import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { wordBank } from '../assets/word-bank'
import { DialogComponent } from '../dialog-component/dialog-component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-card-component',
  templateUrl: './card-component.component.html',
  styleUrls: ['./card-component.component.css']
})
export class CardComponentComponent implements OnInit {
  clueString:string;
  cardType:string;
  revealed:boolean;
  redCount:number;
  blueCount:number;
  cardColor:string;
  textColor:string;
  keepRevealed:boolean;

  @Input() teamGoingFirst:string;
  @Input() currentTeam:string;
  @Input() userType:string;
  @Output() updateCount = new EventEmitter();
  @Output() changeTeam = new EventEmitter();

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.assignClueString();
    this.assignCardType();
  }

  ngOnChanges() {
    if (this.userType === 'Spymaster') {
      if (this.cardType === 'Red') {
        this.cardColor = '#f23e30';
        this.textColor = 'white';
        this.revealed = true;
      } else if (this.cardType === 'Blue') {
        this.cardColor = '#3050f2';
        this.textColor = 'white';
        this.revealed = true;
      } else if (this.cardType === 'Assassin') {
        this.cardColor = '#45464d';
        this.textColor = 'white';
        this.revealed = true;
      } else if (this.cardType === 'Civilian') {
        this.cardColor = '#c2c0ba'
        this.textColor = 'white';
        this.revealed = true;
      }
    } else {
      this.cardColor = '';
      this.textColor = ''
      if (this.keepRevealed) {
        this.revealed = true;
      } else {
        this.revealed = false;
      }
    }
  }

  // Assign Card String
  assignClueString() {
    let wordBankArray = wordBank;
    const randomWord = wordBankArray[Math.floor(Math.random() * wordBankArray.length)];
    wordBankArray.splice(wordBankArray.indexOf(randomWord), 1);
    this.clueString = randomWord;
  }

  // Assign Card Type
  assignCardType() {
    const typeArray = ['Civilian', 'Red', 'Blue', 'Assassin']; 
    const randomType = typeArray[Math.floor(Math.random() * typeArray.length)];
    if (this.teamGoingFirst === 'Red') {
      this.redCount = 9;
      this.blueCount = 8;
    } else if (this.teamGoingFirst === 'Blue') {
      this.redCount = 8;
      this.blueCount = 9;
    }
    if (randomType === 'Red' && Number(localStorage.getItem('redCount')) < this.redCount) {
      this.cardType = randomType;
      this.incrementTypeCount('redCount')
    } else if (randomType === 'Blue' && Number(localStorage.getItem('blueCount')) < this.blueCount) {
      this.cardType = randomType;
      this.incrementTypeCount('blueCount')
    } else if (randomType === 'Assassin' && Number(localStorage.getItem('assassinCount')) < 1) {
      this.cardType = randomType;
      this.incrementTypeCount('assassinCount')
    } else if (randomType === 'Civilian' && Number(localStorage.getItem('civilianCount')) < 7) {
      this.cardType = randomType;
      this.incrementTypeCount('civilianCount')
    } else {
      let index = typeArray.indexOf(randomType);
      typeArray.splice(index,1)
      this.assignCardType();
    }
  }

  incrementTypeCount(cardType) {
    let count = Number(localStorage.getItem(cardType.toString()))
    count++;
    localStorage.setItem(cardType, count.toString());
  }

  decrementTypeCount(cardType) {
    let count = Number(localStorage.getItem(cardType.toString()))
    count--;
    localStorage.setItem(cardType, count.toString());
    if (count === 0) {
      
    }
  }

  // Player clicks button, reveal color
  revealType(event) {
    if (this.cardType === 'Red') {
      this.keepRevealed=true;
      event.target.classList.add("redCard")
      this.revealed = true;
      this.decrementTypeCount('redCount');
      this.updateCount.emit('updateCount')
      if (this.currentTeam === 'Blue') {
        this.changeTeam.emit('changeTeam')
      }
    } else if (this.cardType === 'Blue') {
      this.keepRevealed=true;
      event.target.classList.add("blueCard")
      this.revealed = true;
      this.decrementTypeCount('blueCount');
      this.updateCount.emit('updateCount')
      if (this.currentTeam === 'Red') {
        this.changeTeam.emit('changeTeam');
      }
    } else if (this.cardType === 'Assassin') {
      this.keepRevealed=true;
      event.target.classList.add("assassinCard")
      this.revealed = true;
      this.endGame();
    } else if (this.cardType === 'Civilian') {
      this.keepRevealed=true;
      event.target.classList.add("civilianCard")
      this.revealed = true;
      this.changeTeam.emit('changeTeam');
    }
  }

  // Game Over
  endGame(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      height: '220px',
      data: {modalType: this.currentTeam},
      disableClose: true
    });
  }
}