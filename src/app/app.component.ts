import { Component, ViewChild } from '@angular/core';
import { wordBank } from './assets/word-bank';
import { GeneralService } from './services/general.service';
import { CardComponentComponent } from './card-component/card-component.component';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from './dialog-component/dialog-component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild(CardComponentComponent) child: CardComponentComponent;

  wordArray = [];
  changeCurrenTeam: string;
  currentTeam: string;
  blueTurn = false;
  redTurn = false;
  firstTeamOutput:string;
  blueCount:number;
  redCount:number;
  userType:string;
  userList = [];

  constructor(public generalService: GeneralService, 
              public dialog: MatDialog) {}

  ngOnInit() {
    localStorage.setItem('redCount', '0');
    localStorage.setItem('blueCount', '0');
    localStorage.setItem('assassinCount', '0');
    localStorage.setItem('civilianCount', '0');

    this.assignRoles();
    this.wordArray = wordBank;
    this.assignTeamThatGoesFirst();
  }

  ngAfterViewInit() {
    this.updateCounter();
  }

  updateCounter() {
    setTimeout(() => { 
      this.redCount = Number(localStorage.getItem('redCount'));
      this.blueCount = Number(localStorage.getItem('blueCount'));
    },0)
  }

  resetGame() {
    window.location.reload();
  }

  changeCurrentTeam() {
    if (this.blueTurn) {
      this.currentTeam = 'Red';
      this.blueTurn = false;
      this.redTurn = true;
    } else {
      this.currentTeam = 'Blue';
      this.blueTurn = true;
      this.redTurn = false;
    }
  }

  assignTeamThatGoesFirst() {
    const teamColor = ['Red', 'Blue'];
    const firstTeam = teamColor[Math.floor(Math.random() * teamColor.length)];
    this.currentTeam = firstTeam;
    if (firstTeam === 'Blue') {
      this.blueTurn = true;
      this.firstTeamOutput = 'Blue';
    } else {
      this.redTurn = true;
      this.firstTeamOutput = 'Red';
    }
  }

  setSpyMasterView() {
    if (this.userType === 'Spymaster') {
      this.userType = 'Player'
    } else {
      this.userType = 'Spymaster'
    }
  }

  assignRoles() {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      height: '500px',
      data: {modalType: 'assignRoles', userList: this.userList},
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result=>{
      if (result !== undefined) {
        this.userList = result;
      }
    })
  }
}
