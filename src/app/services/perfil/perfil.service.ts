import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/authRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/authResponse';
import { SingupUserRequest } from 'src/app/models/interfaces/user/singupUserRequest';
import { SingupUserResponse } from 'src/app/models/interfaces/user/singupUserResponse';
import { environment } from 'src/environment/environment';
import { UsuarioRequest } from 'src/app/models/interfaces/user/request/UsuarioRequest';
import { PerfilResponse } from 'src/app/models/interfaces/perfil/response/PerfilResponse';

@Injectable({
  providedIn: 'root'
})
export class PerfilService {

  private PAI_URL = environment.API_URL + "/perfis";

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) { }


  buscarPerfil(id: string): Observable<PerfilResponse>{
    return this.http.get<PerfilResponse>(
      `${this.PAI_URL}/` + id
    )
  }

}
