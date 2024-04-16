import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardComponent } from './dashboard.component';
import { Store, StoreModule } from '@ngrx/store';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { Task } from 'src/app/models/task.interface';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let componentFixture: ComponentFixture<DashboardComponent>;

  let voidFake = () => {};

  let storeUserMock: Store<User>;
  let routerMock: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      imports: [
        FormsModule,
        CommonModule,
        ReactiveFormsModule,
        StoreModule.forRoot({}),
        AppRoutingModule,
      ],
      providers: [
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
          },
        },
        {
          provide: Store,
          useValue: {
            dispatch: jasmine.createSpy('dispatch').and.callFake(voidFake),
          },
        },
      ],
    }).compileComponents();

    componentFixture = TestBed.createComponent(DashboardComponent);
    component = componentFixture.componentInstance;

    routerMock = TestBed.inject(Router);
    storeUserMock = TestBed.inject(Store);

    component.taskForm = new FormGroup({
      name: new FormControl(''),
    });
  });

  it('Init component OK', () => {
    expect(component).toBeTruthy();
  })

  it('Init onInit método', () => {
    spyOn(component, 'initUserSubscribe').and.callFake(voidFake);
    spyOn(component, 'vlidateIfNeccesaryRedirectToLogin').and.callFake(voidFake);
    component.ngOnInit();

    expect(component.vlidateIfNeccesaryRedirectToLogin).toHaveBeenCalled();
  });

  it('Task nuevo validacion taskName NULL', () => {

    component.taskForm = new FormGroup({
      name: new FormControl(''),
    });

    component.add();

    const taskName = component.taskForm.get('name')?.value;
    
    expect(taskName).not.toBeNull();
    expect(taskName.length).toBe(0);
  });

  it('Task nuevo validacion ya existente', () => {

    component.taskForm = new FormGroup({
      name: new FormControl('Test 01'),
    });

    spyOn(component, 'validateForm').and.returnValue(true);
    
    component.add();

    expect(component.msgErrorInput).not.toBeNull();
    expect(component.msgErrorInput).toBe('Tarea ya existe en la lista.');
  });

  it('Task nuevo OK', () => {

    component.taskForm = new FormGroup({
      name: new FormControl('Test 01'),
    });

    spyOn(component, 'validateForm').and.callThrough();
    spyOn(component, 'clearForm').and.callThrough();
    
    component.add();

    expect(component.taskList.length).toBe(1);
    expect(component.clearForm).toHaveBeenCalled();
  });

  it('Marcar check true', () => {
    const task: Task = {
      check: false,
      name: 'Test 01',
      showX: true
    }
    component.checkChange(task);

    expect(component).toBeTruthy();
  });

  it('Eliminar tarea', () => {

    const task: Task = {
      check: false,
      name: 'Test 01',
      showX: true
    }

    component.taskList = [task];

    component.delete(task);

    expect(component.taskList.length).toBe(0);
  })

  it('Digitar A alfanumérico', () => {
    const event = new KeyboardEvent('keypress', { charCode: 65 });
    
    component.onlyAlphanumeric(event);
    
    expect(event.defaultPrevented).toBe(false);
    
  });

  it('Digitar . alfanumérico ERROR NO PRINT', () => {
    spyOn(component, 'clearMessageErrors').and.callFake(voidFake);
    const event = new KeyboardEvent('keypress', { charCode: 46 });
    
    component.onlyAlphanumeric(event);
    
    expect(component.clearMessageErrors).toHaveBeenCalled();
  });

});
