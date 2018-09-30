import * as AWS from 'aws-sdk';
import { from } from 'rxjs';

export class AccountService {
  doc: AWS.DynamoDB.DocumentClient;

  constructor(public tableName: string) {
    this.doc = new AWS.DynamoDB.DocumentClient();
  }

  createAccount(payload: { username: string }) {
    return from(
      this.doc
        .put({
          TableName: this.tableName,
          Item: payload,
        })
        .promise()
    );
  }
}
