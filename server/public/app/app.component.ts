import { Component, OnInit } from '@angular/core';
//
import { TeamService } from './team/team.service';

@Component({
  selector: 'my-app',
  template: `
                <div *ngFor="let teamName of teamNames">
                    <div>{{teamName}}</div>
                </div>
`,
})
export class AppComponent implements OnInit {

  constructor(private teamService: TeamService){}

  name = 'Angular';
  teamNames: string[];
  errorMessage: string;
  teams: any;

  ngOnInit() {
    this.teamService.getTeam()
      .subscribe(
        teams => this.parseTeams(teams),
        error =>  this.errorMessage = <any>error);
  }

  parseTeams(teams: any) {
    this.teams = teams;
    this.teamNames = Object.keys(teams);
  }
}
