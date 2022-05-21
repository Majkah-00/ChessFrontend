import { Component } from '@angular/core';
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from '@angular/router';
import { GameService } from '../../../board/services/game.service';
import { StateService } from '../../../board/services/state.service';
import { WebsocketService } from '../../../board/services/websocket.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent {
  creator = new FormControl('', Validators.required)

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private gameService: GameService,
    private stateService: StateService,
    private websocketService: WebsocketService,
  ) {
  }

  onLocalGame(): void {
    this.router.navigate(['/game'])
  }

  onPlayWithFriend(): void {
    if (this.creator.valid) {
      this.stateService.player.next(this.creator.value)
      this.websocketService.startConnection(); // połączenie do websocketa

      this.gameService.createGame(this.creator.value).subscribe(res => {
        this.stateService.isYourTurn.next(true);
        this.router.navigate([`/game/${res.gameId}`])

        setTimeout(() => {
          this.websocketService.id();
          setTimeout(() => {
            this.gameService.joinGroup(res.gameId).subscribe();
          }, 1000)
        }, 1000)
      });
    }
  }

  onPlayWithComputer(): void {
    this.router.navigate(['/game'], {queryParams: {type: 'computer'}});
  }
}
