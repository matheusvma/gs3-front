import { Node } from './../../../../node_modules/@types/estree/index.d';
import { MessageService } from 'primeng/api';
import { UserService } from './../../services/user/user.service';
import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/authRequest';
import { SingupUserRequest } from 'src/app/models/interfaces/user/singupUserRequest';
import { SingupUserResponse } from 'src/app/models/interfaces/user/singupUserResponse';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnDestroy{
  private destroy$ = new Subject<void>();
  loginCard = true;

  loginForm = this.formBuilder.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  signupForm = this.formBuilder.group({
    nome: ['', Validators.required],
    numTelefone: ['', Validators.required],
    cpf: ['', Validators.required],
    codPerfil: ['', Validators.required],
    username: ['', Validators.required],
    password: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private UserService: UserService,
    private cookieService: CookieService,
    private messageService: MessageService,
    private router: Router
  ) {}

  onSubmitLoginForm(): void{
    if(this.loginForm.value && this.loginForm.valid){
      this.UserService.authUser(this.loginForm.value as AuthRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (response) => {
          if(response){
            debugger;
            this.cookieService.set('USER_INFO', response?.nome);
            this.cookieService.set('USER_PERFIL', response?.codPerfil);
            this.loginForm.reset();
            this.router.navigate(['/dashboard']);

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Bem Vindo de Volta ${response?.nome} !`,
              life: 2500,
            });
          }
        },
        error: (err) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao fazer login!`,
            life: 2500,
          });
          console.log(err);
        },
      });
    }
  }

  onSubmitSingUpForm(): void{
    if(this.signupForm.value && this.signupForm.valid){

      this.UserService.singupUser(this.signupForm.value as SingupUserRequest)
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          if(res){
            this.signupForm.reset();
            this.loginCard = true;
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Usuario criado com sucesso!`,
              life: 2500,
            });
          }
        },
        error: (err) =>{
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao criar usuário!`,
            life: 2500,
          });
          console.log(err);
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
