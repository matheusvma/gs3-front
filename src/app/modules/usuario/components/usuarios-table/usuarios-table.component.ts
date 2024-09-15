import { Component, EventEmitter, Input, Output } from '@angular/core';
import { UsuarioEvent } from 'src/app/models/enums/UsuariosEvent';
import { EventAction } from 'src/app/models/interfaces/user/event/EventAction';
import { SingupUserResponse } from 'src/app/models/interfaces/user/singupUserResponse';

@Component({
  selector: 'app-usuarios-table',
  templateUrl: './usuarios-table.component.html',
  styleUrls: []
})
export class UsuariosTableComponent {

  @Input() usuarios: Array<SingupUserResponse> = [];
  @Output() usuarioEvent = new EventEmitter<EventAction>();

  public usuarioSelected!: SingupUserResponse;
  public editUsuarioEvent = UsuarioEvent.EDIT_PRODUCT_EVENT;

  handleUsuarioEvent(action: string, id?: string): void {
    if (action && action !== '') {
      const usuarioEventData = id && id !== '' ? { action, id } : { action };
      this.usuarioEvent.emit(usuarioEventData);
    }
  }

}
