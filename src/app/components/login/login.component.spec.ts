import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { NO_ERRORS_SCHEMA, inject } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Store, StoreModule } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let componentFixture: ComponentFixture<LoginComponent>;

  let voidFake = () => {};

  let storeUserMock: Store<User>;
  let routerMock: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        AppRoutingModule
      ],
      providers: [ 
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        },
        {
          provide: Store,
          useValue: { 
            dispatch: jasmine.createSpy('dispatch').and.callFake(voidFake)
          }
        }
      ]
    }).compileComponents();

    componentFixture = TestBed.createComponent(LoginComponent);
    component = componentFixture.componentInstance;

    routerMock = TestBed.inject(Router);
    storeUserMock = TestBed.inject(Store);

    component.formLogin = new FormGroup({
      user: new FormControl(),
      pwd: new FormControl()
    })
    
  });

  it('Init compomente', () => {
    expect(component).toBeTruthy();
  });

  it('Login KO mensaje error', () => {

    component.formLogin = new FormGroup({
      user: new FormControl('test00009'),
      pwd: new FormControl('test000010')
    })

    component.login();

    expect(component.messageErrorLogin).toBe('Credenciales incorrectas!');
  });

  
  it('Login OK', () => {
    spyOn(component, 'saveInStoreUser').and.callFake(voidFake);
    
    component.formLogin = new FormGroup({
      user: new FormControl('test01'),
      pwd: new FormControl('test01')
    })

    component.login();

    expect(component.saveInStoreUser).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('Almacenar en memoria ngrx reducer', () => {
    component.formLogin = new FormGroup({
      user: new FormControl('test01'),
      pwd: new FormControl('test01')
    })

    component.saveInStoreUser();

    expect(storeUserMock.dispatch).toHaveBeenCalled();
  })

  it('Validar credenciales', () => {
    component.formLogin = new FormGroup({
      user: new FormControl('test01'),
      pwd: new FormControl('test01')
    })

    const result = component.validateCredential(component.formLogin);

    expect(result).toBeTruthy();

  })
  

});
