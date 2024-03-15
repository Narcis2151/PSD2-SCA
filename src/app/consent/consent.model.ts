import AccountsResponseData from './accounts.model';

type ConsentResponseData = {
  consentId: Number;
  accounts: AccountsResponseData[];
  isRecurrent: Boolean;
  validUntil: Date;
  redirectUrl: String;
};

export default ConsentResponseData;
