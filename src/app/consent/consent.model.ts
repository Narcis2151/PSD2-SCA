import AccountsResponseData from './accounts.model';

type ConsentResponseData =  {
  consentId: Number,
  accounts: AccountsResponseData[],
  isRecurrent: Boolean,
  validUntil: Date
} | null;

export default ConsentResponseData;