import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { StateService } from './state.service';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly endpoints = {
    createGame: `${environment.apiUrl}/games/create-game`,
    getGames: `${environment.apiUrl}/games`,
  }

  constructor(private httpClient: HttpClient, private stateService: StateService) {
  }

  createGame(nick: string): Observable<any> {
    return this.httpClient.post(this.endpoints.createGame, {creator: nick});
  }

  getGames(): Observable<any> {
    return this.httpClient.get(this.endpoints.getGames);
  }

  joinGame(gameId: string, player: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/games/${gameId}/join`, {player});
  }

  move(move: string): Observable<any> {
    return this.httpClient.post(`${environment.apiUrl}/games/${this.stateService.gameId.value}/move`, {
      player: this.stateService.player.value,
      move
    });
  }

  joinGroup(gameId: string): Observable<any> {
    console.log(this.stateService.connectionId.value)
    return this.httpClient.post(`${environment.apiUrl}/games/${gameId}/join-group`, {
      connectionId: this.stateService.connectionId.value,
      player: this.stateService.player.value,
    });
  }

}
