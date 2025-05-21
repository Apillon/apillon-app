import assetHub from './assetHub.json';
import auth from './auth.json';
import computing from './computing.json';
import dashboard from './dashboard.json';
import embeddedWallet from './embeddedWallet.json';
import error from './error.json';
import form from './form.json';
import general from './general.json';
import hosting from './hosting.json';
import indexer from './indexer.json';
import nft from './nft.json';
import profile from './profile.json';
import project from './project.json';
import referral from './referral.json';
import rpc from './rpc.json';
import service from './service.json';
import simplet from './simplet.json';
import smartContracts from './smartContracts.json';
import social from './social.json';
import storage from './storage.json';
import validations from './validations.json';
import w3Warn from './w3Warn.json';

const messages = {
  ...assetHub,
  ...auth,
  ...computing,
  ...dashboard,
  ...embeddedWallet,
  ...error,
  ...form,
  ...general,
  ...hosting,
  ...indexer,
  ...nft,
  ...profile,
  ...project,
  ...referral,
  ...rpc,
  ...service,
  ...simplet,
  ...smartContracts,
  ...social,
  ...storage,
  ...validations,
  ...w3Warn,
};
export default defineI18nLocale(() => messages);
