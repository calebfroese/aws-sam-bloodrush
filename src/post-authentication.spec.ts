import { expect } from 'chai';
import { of } from 'rxjs';
import { createSandbox, SinonStub } from 'sinon';

import { postAuthentication } from './post-authentication';
import { AccountService } from './shared/account.service';

describe(postAuthentication.name, () => {
  let sandbox = createSandbox();
  let createAccountStub: SinonStub;

  before(() => {
    createAccountStub = sandbox
      .stub(AccountService.prototype, 'createAccount')
      .returns(of({ mockCreateResponse: 100 }));
  });

  it('makes the request to create an account', done => {
    const event = {
      userPoolId: 'mock-user-pool',
      userName: 'mock-user-name',
    };
    postAuthentication(event, null, (err: any, data: any) => {
      expect(createAccountStub.calledOnce).true;
      expect(createAccountStub.getCall(0).args).to.deep.equal([
        { username: 'mock-user-name' },
      ]);
      expect(data).to.deep.equal(event);
      done(err);
    });
  });

  afterEach(() => sandbox.reset());
  after(() => sandbox.restore());
});
