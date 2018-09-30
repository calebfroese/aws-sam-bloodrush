import * as faker from 'faker';
import { v4 as uuid } from 'uuid';

import { PlayerService } from './shared/player.service';

/**
 * Runs periodically to create new players and add them to the
 * marketplace.
 *
 * @param event Not used
 * @param ctx Not used
 * @param callback Callback to Lambda
 */
export function addPlayersToMarketplace(event: any, ctx: any, callback: any) {
  // Create some players
  const players: Player[] = new Array(
    parseInt(<string>process.env.PLAYER_COUNT)
  )
    .fill(null)
    .map(() => {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      return {
        id: uuid(),
        firstName,
        lastName,
        name: [firstName, lastName].join(' '),
        countryOfOrigin: faker.address.country(),
        expireAt: new Date(
          Date.now() +
            1000 * 60 * 60 * 24 * parseInt(<string>process.env.PLAYER_TTL_DAYS)
        ).toISOString(),
      };
    });

  // Add the players to the database
  const playerService = new PlayerService(<string>process.env.DB_PLAYERS);
  playerService
    .createPlayers(players)
    .subscribe(() => callback(null), callback);
}
