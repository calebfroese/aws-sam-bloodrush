import * as AWS from 'aws-sdk';
import { from } from 'rxjs';

export class AccountService {
  doc: AWS.DynamoDB.DocumentClient;

  constructor(public tableName: string) {
    this.doc = new AWS.DynamoDB.DocumentClient();
  }

  /**
   * Creates an account item related to the Cognito user
   *
   * @param username Cognito username
   */
  createAccount(username: string) {
    return from(
      this.doc
        .put({
          TableName: this.tableName,
          Item: {
            username,
            teams: [],
          },
        })
        .promise()
    );
  }

  /**
   * Attaches a team to an account
   *
   * @param username Cognito username
   * @param teamId The id of the team to attach to this account
   */
  addTeam(username: string, teamId: string) {
    return from(
      this.doc
        .update({
          TableName: this.tableName,
          Key: {
            username,
          },
          UpdateExpression: 'SET #teamAttr = list_append(#teamAttr, :teamId)',
          ExpressionAttributeNames: {
            '#teamAttr': 'teams',
          },
          ExpressionAttributeValues: {
            ':teamId': [teamId],
          },
        })
        .promise()
    );
  }
}
