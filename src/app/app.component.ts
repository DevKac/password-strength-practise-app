import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { ReplaySubject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { PasswordStrengthService } from 'src/app/services/password-strength/password-strength.service';
import { PasswordScore } from 'src/app/interfaces/password-score.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public loginForm: FormGroup | undefined;
  public passwordScore: PasswordScore = this.passwordStrengthService.getMinPasswordScore();

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private formBuilder: FormBuilder,
    private passwordStrengthService: PasswordStrengthService
  ) {}

  public ngOnInit(): void {
    this.setupForm();
  }

  public ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  public onLogin(): void {
    if (!this.loginForm) {
      console.error('AppComponent: onLogin: loginForm is null or undefined!');
      return;
    }

    this.loginForm.markAllAsTouched();
    console.log(this.loginForm?.valid);
  }

  private setupForm(): void {
    this.loginForm = this.formBuilder.group({
      login: ['', Validators.required],
      password: ['', Validators.required],
    });
    
    this.initPasswordListener();
  }

  private initPasswordListener(): void {
    if (!this.loginForm) {
      console.error('AppComponent: initPasswordListener: loginForm is null or undefined!');
      return;
    }

    const loginFormControl: AbstractControl | null = this.loginForm.get('password');
    if (!loginFormControl) {
      console.error('AppComponent: initPasswordListener: loginFormControl is null or undefined!');
      return;
    }

    loginFormControl.valueChanges.pipe(
      debounceTime(100),
      distinctUntilChanged(),
      takeUntil(this.destroyed$),
    ).subscribe((password: string) => {
      this.passwordScore = this.passwordStrengthService.calculatePasswordScore(password);
    })
  }
}
