// import { Injectable } from '@angular/core';
//
// @Injectable()
// export class Globals {
//   project_id: string = '';
//
// }
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class GlobalsService {

  private project_id = new BehaviorSubject('');
  currentId = this.project_id.asObservable();

  constructor() { }

  changeId(id: string) {
    this.project_id.next(id)
  }

}
