import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  player = new BehaviorSubject('');
  gameId = new BehaviorSubject('');
  connectionId = new BehaviorSubject('');
  isYourTurn = new BehaviorSubject(false);
  history = new BehaviorSubject([]);
}
