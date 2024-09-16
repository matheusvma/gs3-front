import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject, takeUntil } from 'rxjs';
import { UsuarioEvent } from 'src/app/models/enums/UsuariosEvent';
import { PerfilResponse } from 'src/app/models/interfaces/perfil/response/PerfilResponse';
import { EventAction } from 'src/app/models/interfaces/user/event/EventAction';
import { UsuarioRequest } from 'src/app/models/interfaces/user/request/UsuarioRequest';
import { SingupUserRequest } from 'src/app/models/interfaces/user/singupUserRequest';
import { SingupUserResponse } from 'src/app/models/interfaces/user/singupUserResponse';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-usuarios-form',
  templateUrl: './usuarios-form.component.html',
  styleUrls: []
})
export class UsuariosFormComponent implements OnInit, OnDestroy {

  private readonly destroy$: Subject<void> = new Subject();

  public usuarioAction!: {
    event: EventAction;
    usuarioDatas: Array<SingupUserResponse>;
  };

  public productSelectedDatas!: SingupUserResponse;
  public perfil!: PerfilResponse;

  public editUsuarioForm = this.formBuilder.group({
    nome: ['', Validators.required],
    numTelefone: ['', Validators.required],
    cpf: ['', Validators.required],
    username: ['', Validators.required],
    codPerfil: ['', Validators.required],
  });

  public editUsuarioAction = UsuarioEvent.EDIT_PRODUCT_EVENT;

  constructor(
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private router: Router,
    public ref: DynamicDialogConfig,
    private usuarioservice: UserService,
    private cookie: CookieService,
    private perfilService: PerfilService
  ) {}


  ngOnInit(): void {
    this.usuarioAction = this.ref.data;

    if (
      this.usuarioAction?.event?.action === this.editUsuarioAction &&
      this.usuarioAction?.usuarioDatas
    ) {
      this.getUsuarioSelectedDatas(this.usuarioAction?.event?.id as string);
    }

    this.getPerfil();
  }

  getUsuarioSelectedDatas(usuarioId: string): void {
    const allUsuarios = this.usuarioAction?.usuarioDatas;

    if (allUsuarios.length > 0) {
      const usuarioFiltered = allUsuarios.filter(
        (element) => element?.id === usuarioId
      );

      if (usuarioFiltered) {
        this.productSelectedDatas = usuarioFiltered[0];

        this.editUsuarioForm.setValue({
          nome: this.productSelectedDatas?.nome,
          numTelefone: this.productSelectedDatas?.numTelefone,
          cpf: this.productSelectedDatas?.cpf,
          username: this.productSelectedDatas?.username,
          codPerfil: this.productSelectedDatas?.codPerfil
        });
      }
    }
  }

  handleSubmitEditProduct(): void {
    if (
      this.editUsuarioForm.value &&
      this.editUsuarioForm.valid
    ) {
      const requestUsuarioEdit: UsuarioRequest = {
        nome: this.editUsuarioForm.value.nome as string,
        numTelefone: this.editUsuarioForm.value.numTelefone as string,
        cpf: this.editUsuarioForm.value.cpf as string,
        username: this.editUsuarioForm.value.username as string,
        codPerfil: this.editUsuarioForm.value.codPerfil as string
      };

      this.usuarioservice
        .editUsuario(requestUsuarioEdit, this.productSelectedDatas.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Sucesso',
              detail: 'Produto editado com sucesso!',
              life: 2500,
            });
            this.editUsuarioForm.reset();
          },
          error: (err) => {
            console.log(err);
            this.messageService.add({
              severity: 'error',
              summary: 'Erro',
              detail: 'Erro ao editar produto!',
              life: 2500,
            });
            this.editUsuarioForm.reset();
          },
        });
    }
  }

  getPerfil(): void{
    const codPerfil = this.cookie.get('USER_PERFIL');

    this.perfilService
        .buscarPerfil(codPerfil)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.perfil = response;
          },
          error: (err) => {
            console.log(err);
          },
        });

  }

  validaAdmin(): boolean{
    if(this.perfil != null &&
      this.perfil.nome === 'admin' &&
      this.perfil.status === '1'
    ) {
      return true;
    }

    return false;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
