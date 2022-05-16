import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { environment } from '../../../../environments/environment';
import { EngineFacade } from '../engine/engine-facade';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  hubConnection: HubConnection;
  connectionId: string;

  constructor(
    private engineFacade: EngineFacade,
    private stateService: StateService
  ) {
  }

  startConnection = () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(`${environment.apiUrl}/gameHub`)
      .build();

    this.hubConnection.start().catch((err) => console.error(err));

  };

  public onPlayerJoin = () => {
    this.hubConnection.on('onJoin', (result) => {
      console.log(result)
    });
  };

  public onMove = () => {
    this.hubConnection.on('onMove', (result) => {
      console.log(result)
      if (result.player !== this.stateService.player.value) {
        this.stateService.isYourTurn.next(true);
      } else {
        this.stateService.isYourTurn.next(false);
      }
      this.engineFacade.move(result.move)
    });
  };

  public id = () => {
    this.hubConnection.invoke('GetConnectionId').then(res => {
      console.log(res)
      this.stateService.connectionId.next(res)
      this.connectionId = res;
    }).catch((err) => {
      console.error(err);
    });
  };
}
