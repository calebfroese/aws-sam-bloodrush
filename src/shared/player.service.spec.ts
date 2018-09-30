import * as AWS from 'aws-sdk';
import { expect } from 'chai';
import { createSandbox, SinonStub } from 'sinon';

import { PlayerService } from './player.service';

describe(PlayerService.name, () => {
  let sandbox = createSandbox();
  let service: PlayerService;
  let batchWriteStub: SinonStub;
  let deleteStub: SinonStub;
  let getStub: SinonStub;

  before(() => {
    service = new PlayerService('player-table');
    batchWriteStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'batchWrite')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
    deleteStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'delete')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
    getStub = sandbox
      .stub(AWS.DynamoDB.DocumentClient.prototype, 'get')
      .returns({
        promise: () =>
          Promise.resolve({
            mockDynamoResponse: true,
          }),
      });
  });

  it('bulk creates players in dynamodb', done => {
    const players = [
      {
        id: '123',
        firstName: 'Bob',
        lastName: 'Smith',
        name: 'Bob Smith',
        countryOfOrigin: 'USA',
        expireAt: new Date(100).toISOString(),
      },
    ];
    service.createPlayers(players).subscribe(data => {
      expect(batchWriteStub.calledOnce).true;
      expect(batchWriteStub.getCall(0).args).to.deep.equal([
        {
          RequestItems: {
            'player-table': [
              {
                PutRequest: {
                  Item: {
                    id: '123',
                    firstName: 'Bob',
                    lastName: 'Smith',
                    name: 'Bob Smith',
                    countryOfOrigin: 'USA',
                    expireAt: '1970-01-01T00:00:00.100Z',
                  },
                },
              },
            ],
          },
        },
      ]);
      expect(data).to.deep.equal({
        mockDynamoResponse: true,
      });
      done();
    }, done);
  });

  it('deletes a player by id', done => {
    service.deletePlayer('player-032').subscribe(data => {
      expect(deleteStub.calledOnce).true;
      expect(deleteStub.getCall(0).args).to.deep.equal([
        {
          TableName: 'player-table',
          Key: {
            id: 'player-032',
          },
        },
      ]);
      expect(data).to.deep.equal({
        mockDynamoResponse: true,
      });
      done();
    }, done);
  });

  it('gets a player by id', done => {
    service.getPlayer('player-032').subscribe(data => {
      expect(getStub.calledOnce).true;
      expect(getStub.getCall(0).args).to.deep.equal([
        {
          TableName: 'player-table',
          Key: {
            id: 'player-032',
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
