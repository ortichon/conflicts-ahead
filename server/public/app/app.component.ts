import { Component, OnInit } from '@angular/core';
//
import { TeamService } from './team/team.service';

@Component({
  selector: 'my-app',
  template: `
                <div *ngFor="let repoName of repos">
                    <div (click)="getUsers(repoName)">
                        {{repoName}}
                    </div>
                </div>
                <div *ngIf="users">
                    <div *ngFor="let user of users">
                    <div *ngFor="let attribute of userAttributes">
                        {{attribute}}: {{user[attribute]}}
                    </div>
                </div>
                </div>
`,
})
export class AppComponent implements OnInit {

  constructor(private teamService: TeamService){}

  name = 'Angular';
  teamNames: string[];
  errorMessage: string;
  repos: string[];
  users: string[];
  // TODO; move to model/enum
  userAttributes: string[] = ['username', 'ip', 'isActive', 'touchedFiles', 'lastModified'];

  ngOnInit() {
    this.teamService.getRepos()
      .subscribe(
        teams => this.parseTeams(teams),
        error =>  this.errorMessage = <any>error
      );
  }

  getUsers(repoName: string) {
    this.teamService.getUsers(repoName)
      .subscribe(
        users => this.users = users,
        error => this.errorMessage = <any>error
      );
  }

  parseTeams(repos: string[]) {
    console.log('teams: ', repos);
    this.repos = repos;
  }
}
