import { expect } from 'chai';
import * as faker from 'faker';
import { of } from 'rxjs';
import { createSandbox, SinonStub } from 'sinon';

import { addPlayersToMarketplace } from './add-players-to-marketplace';
import { PlayerService } from './shared/player.service';

describe(addPlayersToMarketplace.name, () => {
  let sandbox = createSandbox();
  let addPlayersStub: SinonStub;

  before(() => {
    process.env.PLAYER_COUNT = '3';
    process.env.PLAYER_TTL_DAYS = '30';
    addPlayersStub = sandbox
      .stub(PlayerService.prototype, 'createPlayers')
      .returns(of({ mockCreateResponse: 100 }));
    sandbox.stub(faker.name, 'firstName').returns('Fake firstName');
    sandbox.stub(faker.name, 'lastName').returns('Fake lastName');
    sandbox.stub(faker.address, 'country').returns('Fake country');
  });

  it('creates the expected amount of players', done => {
    addPlayersToMarketplace(null, null, (err: any, data: any) => {
      expect(addPlayersStub.calledOnce).true;
      expect(addPlayersStub.getCall(0).args[0]).lengthOf(3);
      addPlayersStub.getCall(0).args[0].forEach((playerCreateRequest: any) => {
        // id is a valid uuid
        expect(playerCreateRequest['id']).exist;
        expect(playerCreateRequest['id']).contains('-');
        expect(playerCreateRequest['id']).lengthOf(36);
        // player has fake properties as expected
        expect(playerCreateRequest['firstName']).eq('Fake firstName');
        expect(playerCreateRequest['lastName']).eq('Fake lastName');
        expect(playerCreateRequest['name']).eq('Fake firstName Fake lastName');
        expect(playerCreateRequest['countryOfOrigin']).eq('Fake country');
        expect(playerCreateRequest['expireAt']).exist;
      });
      done(err);
    });
  });

  afterEach(() => sandbox.resetHistory());
  after(() => sandbox.restore());
});
