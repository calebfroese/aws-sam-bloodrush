import { switchMap } from 'rxjs/operators';
import { v4 as uuid } from 'uuid';

import { AccountService } from './shared/account.service';
import { TeamService } from './shared/team.service';

interface EventInput {
  team: {
    name: string;
    abbreviation: string;
  };
  username: string;
}

export function createTeam(event: EventInput, ctx: any, callback: any) {
  const accountService = new AccountService(<string>process.env.DB_ACCOUNTS);
  const teamService = new TeamService(<string>process.env.DB_TEAMS);
  const team: Team = { ...event.team, id: uuid() };
  teamService
    .createTeam(event.username, team)
    .pipe(switchMap(() => accountService.addTeam(event.username, team.id)))
    .subscribe(() => callback(null, team), callback);
}
