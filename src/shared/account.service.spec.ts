import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

import { AccountService } from './account.service';

describe(AccountService.name, () => {
  let sandbox = createSandbox();
  let service: AccountService;
  let putStub: SinonStub;
  let updateStub: SinonStub;

  before(() => {
    service = new AccountService('account-table');
    putStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'put')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
    updateStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'update')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
  });

  it('creates account in dynamodb', done => {
    service.createAccount('tom-smith').subscribe(data => {
      expect(putStub.calledOnce).true;
      expect(putStub.getCall(0).args).to.deep.equal([
        {
          TableName: 'account-table',
          Item: { username: 'tom-smith', teams: [] },
        },
      ]);
      expect(data).to.deep.equal({
        mockDynamoResponse: true,
      });
      done();
    }, done);
  });

  it('appends a team to the list', done => {
    service.addTeam('tom-smith', 'panthers').subscribe(data => {
      expect(updateStub.calledOnce).true;
      expect(updateStub.getCall(0).args).to.deep.equal([
        {
          TableName: 'account-table',
          Key: {
            username: 'tom-smith',
          },
          UpdateExpression: 'SET teams = list_append(teams, :teamId)',
          ExpressionAttributeValues: {
            teamId: 'panthers',
          },
        },
      ]);
      expect(data).to.deep.equal({
        mockDynamoResponse: true,
      });
      done();
    }, done);
  });

  afterEach(() => sandbox.resetHistory());
  after(() => sandbox.restore());
});
