import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { loginCreateAction } from 'src/app/utils/ngrx-store-login/user.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  formLogin: FormGroup = new FormGroup({});
  messageErrorLogin: string = '';

  constructor(private router: Router,private store: Store<User>) {
    this.initFormLogin();
  }

  initFormLogin(): void {
    this.formLogin = new FormGroup({
      user: new FormControl('test01'),
      pwd: new FormControl('test01')
    });
  }

  login(): void {

    const isInValidateCredential = !this.validateCredential(this.formLogin);

    if(isInValidateCredential) {
      this.messageErrorLogin = "Credenciales incorrectas!"
      return;
    }

    this.saveInStoreUser();

    this.router.navigate(['/dashboard']);
  }

  saveInStoreUser(): void {
    const userName = this.formLogin.get('user')?.value;
    const user: User = { name: userName };
    this.store.dispatch(loginCreateAction({ user }));
  }

  validateCredential(form: FormGroup): boolean {
    const credential: any = form.getRawValue();
    return credential.user === 'test01' && credential.pwd === 'test01';
  }

}
