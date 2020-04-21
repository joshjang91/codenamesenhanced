import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import { FormControl } from '@angular/forms';

class Player {
  name:string;
  role:string;
  team:string;
}

@Component({
    selector: 'dialog-component',
    templateUrl: 'dialog-component.html',
  })
  export class DialogComponent implements OnInit {
  
    currentTeam:string;
    assignRoles = false;
    gameOver = false;
    userList = [];
    name:string;
    errorMessage = false;
    nameControl:FormControl;
    textColor:string;
    roles = [
      {value:'Guesser', viewValue:'Guesser'},
      {value:'Clue Giver', viewValue:'Clue Giver'}
    ];
    teams = [
      {value:'Red', viewValue:'Team Red'},
      {value:'Blue', viewValue:'Team Blue'}
    ];

    constructor(
      public dialogRef: MatDialogRef<DialogComponent>,
      @Inject(MAT_DIALOG_DATA) public data:any) {}
    
    ngOnInit() {
      if (this.data.modalType === 'Red' || this.data.modalType === 'Blue') {
        this.gameOver = true;
        this.assignRoles = false;
      } else {
        this.assignRoles = true;
        this.gameOver = false;
      }

      this.nameControl = new FormControl('');
      this.userList = this.data.userList;
    }

    // TODO: Find way to refresh just card components/grid
    playAgain(): void {
        window.location.reload();
    }

    validateUsers() {
      let error = 0;
      // TODO: Use validation error and <mat-error>
      this.userList.forEach(x => {
        if (x.role === undefined || x.role === null) {
          alert('Please fill in Role for each user');
          error++;
        } else if (x.team === undefined || x.team === null) {
          alert('Please fill in Team for each user');
          error++;
        }
      })
      if (error === 0) {
        return true;
      } else {
        return false;
      }
    }

    closeModal() {
      if (this.validateUsers()) {
        this.dialogRef.close(this.userList);
      }
    }

    addUser() {
      const index = this.userList.findIndex(x => x.name === this.name);
      if (index > -1 || this.name === '' || this.name === undefined) {
        this.nameControl.markAsDirty();
      } else {
        this.errorMessage = false;
        const newUser = new Player();
        newUser.name = this.name;
        newUser.team = null;
        newUser.role = null;
        this.userList.push(newUser);
        this.name = '';
      }
    }

    removeUser(index) {
      this.userList.splice(index,1);
    }

    onRoleChange(event,index) {
      this.userList[index].role = event.value;
    }

    onTeamChange(event,index) {
      this.userList[index].team = event.value;
    }
  }