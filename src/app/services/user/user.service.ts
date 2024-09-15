import { CookieService } from 'ngx-cookie-service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthRequest } from 'src/app/models/interfaces/user/auth/authRequest';
import { AuthResponse } from 'src/app/models/interfaces/user/auth/authResponse';
import { SingupUserRequest } from 'src/app/models/interfaces/user/singupUserRequest';
import { SingupUserResponse } from 'src/app/models/interfaces/user/singupUserResponse';
import { environment } from 'src/environment/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private PAI_URL = environment.API_URL + "/usuarios";

  constructor(
    private http: HttpClient,
    private cookie: CookieService,
  ) { }


  singupUser(request: SingupUserRequest): Observable<SingupUserResponse>{
    return this.http.post<SingupUserResponse>(
      `${this.PAI_URL}`,
      request
    )
  }

  getAllUsers(): Observable<Array<SingupUserResponse>>{
    return this.http.get<Array<SingupUserResponse>>(
      `${this.PAI_URL}`
    )
  }

  getAllUsuarios(): Observable<Array<SingupUserResponse>>{
    return this.http.get<Array<SingupUserResponse>>(
      `${this.PAI_URL}`
    )
  }

  authUser(request: AuthRequest){
    return this.http.post<AuthResponse>(
      `${this.PAI_URL}/login`,
      request
    )
  }

  isLoggedIn(): boolean {
    // valida o token do usuario logado
    const JWT_TOKEN = this.cookie.get('USER_INFO');
    return JWT_TOKEN != null ? true : false;
  }
}
