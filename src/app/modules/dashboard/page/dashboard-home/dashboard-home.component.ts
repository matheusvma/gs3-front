import { ChartData, ChartOptions } from 'chart.js';
import { UserService } from './../../../../services/user/user.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { SingupUserResponse } from 'src/app/models/interfaces/user/singupUserResponse';
import { CookieService } from 'ngx-cookie-service';
import { PerfilService } from 'src/app/services/perfil/perfil.service';
import { PerfilResponse } from 'src/app/models/interfaces/perfil/response/PerfilResponse';

@Component({
  selector: 'app-dashboard-home',
  templateUrl: './dashboard-home.component.html',
  styleUrls: [],
})
export class DashboardHomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public listaUsuarios: Array<SingupUserResponse> = [];

  public usuariosChartDatas!: ChartData;
  public usuariosChartOptions!: ChartOptions;
  public perfil!: PerfilResponse;

  constructor(
    private messageService: MessageService,
    private UserService: UserService,
    private cookie: CookieService,
    private perfilService: PerfilService
  ) {}

  ngOnInit(): void {
    this.getUsuariosDatas();
    this.getPerfil();
  }

  getUsuariosDatas(): void {
    this.UserService
      .getAllUsuarios()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.listaUsuarios = response;
            this.setUsuaariosChartConfig();
          }
        },
        error: (err) => {
          console.log(err);
          this.messageService.add({
            severity: 'error',
            summary: 'Erro',
            detail: 'Erro ao buscar produtos!',
            life: 2500,
          });
        },
      });
  }

  setUsuaariosChartConfig(): void {
    if (this.listaUsuarios.length > 0) {
      const documentStyle = getComputedStyle(document.documentElement);
      const textColor = documentStyle.getPropertyValue('--text-color');
      const textColorSecondary = documentStyle.getPropertyValue(
        '--text-color-secondary'
      );
      const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

      this.usuariosChartDatas = {
        labels: this.listaUsuarios.map((element) => element?.nome),
        datasets: [],
      };

      this.usuariosChartOptions = {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
          legend: {
            labels: {
              color: textColor,
            },
          },
        },

        scales: {
          x: {
            ticks: {
              color: textColorSecondary,
              font: {
                weight: 500,
              },
            },
            grid: {
              color: surfaceBorder,
            },
          },
          y: {
            ticks: {
              color: textColorSecondary,
            },
            grid: {
              color: surfaceBorder,
            },
          },
        },
      };
    }
  }

  getPerfil(): void{
    const codPerfil = this.cookie.get('USER_PERFIL');

    this.perfilService
        .buscarPerfil(codPerfil)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (response) => {
            this.cookie.set('USER_ADMIN', response?.nome);
            this.perfil = response;
          },
          error: (err) => {
            console.log(err);
          },
        });

  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
