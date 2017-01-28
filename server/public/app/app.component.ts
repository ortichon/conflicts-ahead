import { Component, OnInit } from '@angular/core';
//
import { TeamService } from './team/team.service';

@Component({
  selector: 'my-app',
  template: `<h1>Hello {{name}} {{teamList}}</h1>`,
})
export class AppComponent implements OnInit {

  constructor(private teamService: TeamService){}

  name = 'Angular';
  teamList: string;
  errorMessage: string;

  ngOnInit() {
    this.teamService.getTeam()
      .subscribe(
        teams => this.teamList = teams.join(', '),
        error =>  this.errorMessage = <any>error);
  }
}
