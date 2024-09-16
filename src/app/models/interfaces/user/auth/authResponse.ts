import { PerfilResponse } from "../../perfil/response/PerfilResponse";

export interface AuthResponse {
  id: string,
  nome: string,
  numTelefone: string,
  cpf: string,
  codPerfil: string,
  username: string,
  perfil: PerfilResponse,
}
