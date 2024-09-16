import { SourceMapUnion } from './../../../../../../node_modules/@angular-devkit/build-angular/src/builders/browser-esbuild/schema.d';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { EventAction } from 'src/app/models/interfaces/user/event/EventAction';
import { SingupUserResponse } from 'src/app/models/interfaces/user/singupUserResponse';
import { UserService } from 'src/app/services/user/user.service';
import { UsuariosFormComponent } from '../../components/usuarios-form/usuarios-form.component';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-usuarios-home',
  templateUrl: './usuarios-home.component.html',
  styleUrls: []
})
export class UsuariosHomeComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();
  private ref!: DynamicDialogRef;
  public usuariosDatas: Array<SingupUserResponse> = [];

  constructor(
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private usuarioService: UserService,
    private cookie: CookieService,
  ) {}

  ngOnInit(): void {
    this.getUsuariosServiceDatas();
  }

  getUsuariosServiceDatas(){
    this.usuarioService.getAllUsuarios()
      .pipe(
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          if(res){
            if(this.cookie.get('USER_ADMIN') === 'Admin') {
              this.usuariosDatas = res;
            } else {
              this.usuariosDatas = res?.filter(
                (element) => element?.nome === this.cookie.get('USER_INFO')
              );
            }

            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: `Usuários carregado com sucesso!`,
              life: 2500,
            });
          }
        },
        error: (err) =>{
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: `Erro ao carregar usuários!`,
            life: 2500,
          });
          console.log(err);
        },
      });

  }

  handleUsuarioAction(event: EventAction): void {
    if (event) {
      this.ref = this.dialogService.open(UsuariosFormComponent, {
        header: event?.action,
        width: '70%',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
        maximizable: true,
        data: {
          event: event,
          usuarioDatas: this.usuariosDatas,
        },
      });
      this.ref.onClose.pipe(takeUntil(this.destroy$)).subscribe({
        next: () => this.getUsuariosServiceDatas(),
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
