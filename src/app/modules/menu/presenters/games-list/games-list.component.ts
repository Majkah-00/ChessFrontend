import { Component, OnInit } from '@angular/core';
import { GameService } from '../../../board/services/game.service';
import { Router } from '@angular/router';
import { StateService } from '../../../board/services/state.service';
import { WebsocketService } from '../../../board/services/websocket.service';

@Component({
  selector: 'app-games-list',
  templateUrl: './games-list.component.html',
  styleUrls: ['./games-list.component.scss']
})
export class GamesListComponent implements OnInit {
  games: any[];

  constructor(
    private gameService: GameService,
    private router: Router,
    private stateService: StateService,
    private websocketService: WebsocketService,
  ) { }

  ngOnInit(): void {
    this.gameService.getGames().subscribe(res => {
      this.games = res;
    })
  }


  join(gameId: string): void {
    // TODO zrobić input
    this.stateService.player.next('PLAYER2');
    this.gameService.joinGame(gameId, 'PLAYER2').subscribe(res => {
      this.stateService.isYourTurn.next(false)
      this.router.navigate([`/game/${gameId}`])
    })

    this.websocketService.startConnection(); // połączenie do websocketa
    setTimeout(() => {
      this.websocketService.id();
      setTimeout(() => {
        this.gameService.joinGroup(gameId).subscribe();
      }, 1000)
    }, 1000)
  }
}
