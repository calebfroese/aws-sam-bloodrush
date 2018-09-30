import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

import { AccountService } from './account.service';

describe(AccountService.name, () => {
  let sandbox = createSandbox();
  let service: AccountService;
  let putStub: SinonStub;

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
  });

  it('creates account in dynamodb', done => {
    service.createAccount({ username: 'tom-smith' }).subscribe(data => {
      expect(putStub.calledOnce).true;
      expect(putStub.getCall(0).args).to.deep.equal([
        { TableName: 'account-table', Item: { username: 'tom-smith' } },
      ]);
      expect(data).to.deep.equal({
        mockDynamoResponse: true,
      });
      done();
    }, done);
  });

  afterEach(() => sandbox.reset());
  after(() => sandbox.restore());
});
