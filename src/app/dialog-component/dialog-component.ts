import {Component, Inject, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';

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
    }

    playAgain(): void {
        window.location.reload();
    }

    closeModal() {
      this.dialogRef.close(this.userList);
    }

    addUser() {
      if (this.userList.indexOf(this.name) > -1) {
        this.errorMessage = true;
      } else {
        this.errorMessage = false;
        this.userList.push(this.name);
        this.name = '';
      }
    }
  
  }