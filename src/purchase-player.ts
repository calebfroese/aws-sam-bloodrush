import { PlayerService } from './shared/player.service';
import { TeamService } from './shared/team.service';
import { switchMap, map, mapTo } from 'rxjs/operators';

interface EventInput {
  username: string;
  teamId: string;
  playerId: string;
}

export function purchasePlayer(event: EventInput, ctx: any, callback: any) {
  const teamService = new TeamService(<any>process.env.DB_TEAMS);
  const playersService = new PlayerService(<any>process.env.DB_PLAYERS);

  playersService
    .getPlayer(event.playerId)
    .pipe(
      switchMap(result =>
        teamService.addPlayerToTeam(
          event.username,
          event.teamId,
          result.Item as Player
        )
      ),
      switchMap(player =>
        playersService.deletePlayer(player.id).pipe(mapTo(player))
      )
    )
    .subscribe(player => callback(null, player), callback);
}
