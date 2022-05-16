import axios, { AxiosInstance } from 'axios';

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Bot {
  private token = "Bearer lip_aJavyDCUvok0F9DH6BHW";
  private instance: AxiosInstance;
  public gameId = null;
  public botlevel: number;
  public playerPlaying: string;
  public playerlastmove;

  constructor(private http: HttpClient) {
    this.instance = axios.create({
      baseURL: 'https://lichess.org',
      headers: {
        'Authorization': this.token
      }
    });
  }

  async start(board: any) {
    console.log('Starting bot game');
    this.playerlastmove = (this.playerPlaying != 'white');
    const body = {
      level: 8,
      days: '1',
      color: this.playerPlaying
    };
    await this.instance.post('/api/challenge/ai', body).then(response => {
      this.gameId = response.data.id;
      if (this.playerPlaying != 'white') {
        setTimeout(this.getBotmove, 2000, this.instance, this.gameId, board);
      }
    });
  }

  async makeMoove(move: string, board: any) {
    console.log('Player do ', move);
    await this.instance.post(`/api/board/game/${this.gameId}/move/${move}`)
      .then(() => {
        setTimeout(this.getBotmove, 2000, this.instance, this.gameId, board, move);
      });
  }

  private async getBotmove(instance, gameId, board, move) {
    await instance.get('/api/account/playing')
      .then(response => {
        const game = (response.data.nowPlaying.filter(element => element.gameId == gameId))[0];
        console.log(game)
        var botmove = game.lastMove;
        switch (botmove) {
          case 'e8a8':
            botmove = 'e8c8';
            break;
          case 'e8h8':
            botmove = 'e8g8';
            break;
          case 'e1a1':
            botmove = 'e1c1';
            break;
          case 'e1h1':
            botmove = 'e1g1';
        }
        // if(botmove != move) { // case that lichess take longer to calculate next moove and we get our move as bot move
        console.log(botmove)
        board.move(botmove);
        console.log('Bot do ', botmove);
        board.bot.playerlastmove = false;
        // } else {
        //     setTimeout(this.getBotmove, 4000, instance, gameId, board, move);
        // }
      });
  }

  async cleanAccount() {
    console.log('Cleaning Account');
    await this.instance.get('/api/account/playing')
      .then(response => {
        for (let i = 0; i < response.data.nowPlaying.length; i++) {
          this.instance.post(`/api/board/game/${response.data.nowPlaying[i].gameId}/resign`);
        }
      });
  }


}
