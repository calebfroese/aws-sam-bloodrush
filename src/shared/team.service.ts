import * as AWS from 'aws-sdk';
import { from } from 'rxjs';

export class TeamService {
  doc: AWS.DynamoDB.DocumentClient;

  constructor(public tableName: string) {
    this.doc = new AWS.DynamoDB.DocumentClient();
  }

  /**
   * Creates a team owned by the user
   *
   * @param username Cognito username
   * @param payload Team to be created
   */
  createTeam(username: string, payload: Team) {
    return from(
      this.doc
        .put({
          TableName: this.tableName,
          Item: {
            id: payload.id,
            name: payload.name,
            abbreviation: payload.abbreviation,
            owner: username,
            players: [],
          },
        })
        .promise()
    );
  }

  /**
   *
   * @param username Cognito username
   * @param teamId Team ID
   * @param payload Player to be created on the team
   */
  addPlayerToTeam(username: string, teamId: string, payload: Player) {
    return from(
      this.doc
        .update({
          TableName: this.tableName,
          Key: {
            id: teamId,
          },
          UpdateExpression:
            'SET #playerAttr = list_append(#playerAttr, :player)',
          ExpressionAttributeNames: {
            '#playerAttr': 'players',
          },
          // Can only add a player on a team the user owns
          ConditionExpression: 'username = :username',
          ExpressionAttributeValues: {
            ':player': payload,
            ':username': username,
          },
        })
        .promise()
    );
  }
}
