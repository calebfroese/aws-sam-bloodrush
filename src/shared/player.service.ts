import * as AWS from 'aws-sdk';
import { from } from 'rxjs';

export class PlayerService {
  doc: AWS.DynamoDB.DocumentClient;

  constructor(public tableName: string) {
    this.doc = new AWS.DynamoDB.DocumentClient();
  }

  /**
   * Adds players to the player database.
   *
   * @param players An array of Player objects
   */
  createPlayers(players: Player[]) {
    return from(
      this.doc
        .batchWrite({
          RequestItems: {
            [this.tableName]: players.map(player => ({
              PutRequest: {
                Item: player,
              },
            })),
          },
        })
        .promise()
    );
  }
}
