import {
  Component,
  ElementRef,
  OnChanges, OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { Board } from "../../models/board";
import { EngineFacade } from '../../engine/engine-facade';
import { ClickUtils } from "../../engine/utils/click-utils";
import { Bot } from '../../engine/ai/bot';
import { ActivatedRoute } from '@angular/router';
import { GameService } from '../../services/game.service';
import { StateService } from '../../services/state.service';
import { WebsocketService } from '../../services/websocket.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('boardRef') boardRef!: ElementRef;
  boardSize = 500;
  pieceSize = this.boardSize / 8;
  lightDisabled: boolean;
  darkDisabled: boolean;

  constructor(
    public engineFacade: EngineFacade,
    public board: Board,
    private bot: Bot,
    private activatedRoute: ActivatedRoute,
    private gameService: GameService,
    private stateService: StateService,
    private websocketService: WebsocketService,
  ) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: any) => {
      if (params?.type) {
        this.bot.botlevel = 3;
        this.bot.playerPlaying = 'white';
        this.bot.start(this);
      }
    })

    this.activatedRoute.params.subscribe((params: any) => {
      if (params?.id) {
        this.stateService.gameId.next(params?.id);
        this.websocketService.onPlayerJoin(); // websocket z nasłuciwaniem na dołączneie do gry
        this.websocketService.onMove(); // websocket z nasłuciwaniem na ruch
      }
    })

    this.stateService.history.subscribe(res => {
      console.log(res)
    })
  }

  ngOnChanges(changes: any) {
    // console.log(this.viaNetwork)
    // zmiana zawodnika
    if (
      (changes.lightDisabled &&
        this.lightDisabled &&
        this.board.currentWhitePlayer) ||
      (changes.darkDisabled &&
        this.darkDisabled &&
        !this.board.currentWhitePlayer)
    ) {
      this.board.possibleCaptures = [];
      this.board.possibleMoves = [];
    }

  }

  ngOnDestroy(): void {
    this.bot.cleanAccount();
  }

  // metoda ktora zwroci kolor pola
  getTileBackgroundColor(i: number, j: number): string {
    return ((i + j) % 2 === 0) ? '#BAA378' : '#61543DFF';
  }

  onMouseDown(event: MouseEvent) {
    this.engineFacade.onMouseDown(event, this.getClickPoint(event));
  }

  getClickPoint(event: any) {
    return ClickUtils.getClickPoint(
      event,
      this.boardRef.nativeElement.getBoundingClientRect().top,
      this.boardRef.nativeElement.getBoundingClientRect().height,
      this.boardRef.nativeElement.getBoundingClientRect().left,
      this.boardRef.nativeElement.getBoundingClientRect().width
    );
  }
}
