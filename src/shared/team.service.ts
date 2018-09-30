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
          },
        })
        .promise()
    );
  }
}
