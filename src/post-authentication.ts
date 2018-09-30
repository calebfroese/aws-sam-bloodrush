import { AccountService } from './shared/account.service';

interface EventInput {
  userPoolId: string;
  userName: string;
  [key: string]: any;
}

export function postAuthentication(event: EventInput, ctx: any, callback: any) {
  const accountService = new AccountService(<any>process.env.DB_ACCOUNTS);
  accountService
    .createAccount(event.userName)
    .subscribe(() => callback(null, event), callback);
}
