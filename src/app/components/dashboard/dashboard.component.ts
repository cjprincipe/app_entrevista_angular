import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store, select } from '@ngrx/store';
import { Task } from 'src/app/models/task.interface';
import { User } from 'src/app/models/user.model';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  taskForm: FormGroup = new FormGroup({});
  taskList: Task[] = [];
  msgErrorInput: string = '';
  userLogged: any | null = null;


  constructor(private store: Store<{ user: User | null }>, private router: Router) {
    this.initForm();
  }

  ngOnInit(): void {
    this.initUserSubscribe();
    this.vlidateIfNeccesaryRedirectToLogin();
  }

  initForm(): void {
    this.taskForm = new FormGroup({
      name: new FormControl(''),
    });
  }

  initUserSubscribe(): void {
    this.store.pipe(select('user')).subscribe(user => {
      this.userLogged = user;
    });
  }

  vlidateIfNeccesaryRedirectToLogin() {
    if(this.userLogged && this.userLogged.user !== null) return;
    this.router.navigate(['']);
  }

  add(): void {
    const taskName = this.taskForm.get('name')?.value;

    if(taskName.length < 1) return;

    const existeNameInList = this.validateForm(taskName);

    if(existeNameInList) {
      this.msgErrorInput = 'Tarea ya existe en la lista.'
      return;
    }

    const task: Task = {
      check: false,
      name: taskName,
      showX: true
    } 

    this.taskList.push(task);
    this.clearForm();
  };

  clearForm(): void {
    this.taskForm.get('name')?.setValue('');
  }

  clearMessageErrors(): void {
    this.msgErrorInput = '';
  }

  validateForm(taskName: string): boolean {
    const existName = this.taskList.find((task: Task) => task.name === taskName);

    return !!existName;
  }

  checkChange(taskSelected: Task): void {
    taskSelected.check = !taskSelected.check;
    taskSelected.showX = !taskSelected.showX;
  }

  delete(task: Task): void {
    this.taskList = this.taskList.filter((item: Task) => item.name !== task.name);
  }

  onlyAlphanumeric(event: KeyboardEvent) {
    this.clearMessageErrors();
    const pattern = /^[a-zA-Z0-9\s]+$/; ///^[a-zA-Z0-9]+$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      console.log(1)
      event.preventDefault();
    }
    console.log(2)
  }
}
