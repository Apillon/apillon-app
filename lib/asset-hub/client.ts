import { ApiPromise, SubmittableResult, WsProvider } from '@polkadot/api';
import { timeout } from '~/lib/asset-hub/helpers';
import '@polkadot/api-augment';
import '@polkadot/types-augment';
import type { SubmittableExtrinsic } from '@polkadot/api/types';
import type { ISubmittableResult } from '@polkadot/types/types';

export class AssetHubClient {
  private static instance: AssetHubClient | null;

  private api: ApiPromise;
  private readonly account: WalletAccount;
  public txApproved: Boolean;

  private constructor(api: ApiPromise, account: WalletAccount) {
    this.api = api;
    this.account = account;
    this.txApproved = false;
  }

  static async getInstance(rpcEndpoint: string, account: WalletAccount) {
    if (!AssetHubClient.instance) {
      const api = await ApiPromise.create({
        provider: new WsProvider(rpcEndpoint),
        throwOnConnect: true,
        noInitWarn: true,
      });

      AssetHubClient.instance = new AssetHubClient(api, account);
    }
    return AssetHubClient.instance;
  }

  async destroyInstance() {
    if (AssetHubClient.instance) {
      await this.api.disconnect();
      AssetHubClient.instance = null;
    }
  }

  getAccountAddress() {
    return typeof this.account === 'string' ? this.account : this.account.address;
  }

  private async signAndSend(tx: SubmittableExtrinsic<'promise'>) {
    const signedTx = await tx.signAsync(this.account.address, {
      signer: this.account.signer,
      nonce: -1,
    });
    this.txApproved = true;

    return await this.sendAsync(signedTx);
  }

  private async sendAsync(
    transaction: SubmittableExtrinsic<'promise'>,
    waitForFinalization = true
  ): Promise<SubmittableResult> {
    const decodeError = this.decodeError(this.api);
    function submit(): Promise<SubmittableResult> {
      return new Promise((resolve, reject) => {
        timeout(async () => {
          await transaction
            .send((result, extra) => {
              if (result.status.isInBlock) {
                const error = decodeError(result);
                if (error) {
                  return reject(error);
                }
                if (!waitForFinalization) {
                  return resolve(result);
                }
              }
              if (result.status.isFinalized) {
                return resolve(result);
              }
              if (
                result.status.isInvalid ||
                result.status.isDropped ||
                result.status.isUsurped ||
                result.isError
              ) {
                const error = decodeError(result);
                return error ? reject(error) : reject(result);
              }
              // TODO: should we check this status?
              // if (result.status.isRetracted) {
              //   const error = decodeError(result);
              //   return error ? reject(error) : reject(result);
              // }
            })
            .catch(e => reject(e));
        }, 60_000).catch(e => reject(e));
      });
    }

    for (let i = 0; i < 200; ++i) {
      try {
        return await submit();
      } catch (e) {
        const msg =
          typeof e == 'string'
            ? e.toLowerCase()
            : e?.message
              ? e?.message.toString().toLowerCase()
              : String(e);
        if (msg.includes('priority is too low')) {
          await sleep(50);
          continue;
        } else if (msg.includes('transaction is outdated')) {
          continue;
        } else if (msg.includes('timeout')) {
          i += 9;
          continue;
        }

        throw e;
      }
    }

    throw new Error('Could not execute extrinsic');
  }

  private decodeError(api: ApiPromise) {
    return (result: ISubmittableResult) => {
      for (const e of result.events) {
        if (api.events.system.ExtrinsicFailed.is(e.event)) {
          const [error, _info] = e.event.data;
          if (error.isModule) {
            const { docs, method, section } = api.registry.findMetaError(error.asModule);
            return new Error(`${section}.${method}: ${docs.join(' ')}`);
          }

          return new Error(error.toString());
        }
      }
      return null;
    };
  }

  // QUERIES
  async getAccountBalance(id: number, address: string) {
    const result = await this.api.query.assets.account(id, address);

    return result.isEmpty ? null : result.unwrap();
  }
  async getBalances() {
    return await this.api.query.balances.account(this.account.address);
  }
  async getAssets() {
    return await this.api.query.assets.asset.entries();
  }

  async getAssetMetadata(id: number) {
    return await this.api.query.assets.metadata(id);
  }

  async getAssetDetails(id: number) {
    const result = await this.api.query.assets.asset(id);

    return result.isEmpty ? null : result.unwrap();
  }

  async getNextId() {
    return await this.api.query.assetConversion.nextPoolAssetId();
  }

  // TRANSACTIONS

  async createAsset(
    admin: string,
    id: number,
    name: string,
    symbol: string,
    decimals: number,
    minBalance: number,
    team?: { issuer: string; admin: string; freezer: string }
  ) {
    const createTx = this.api.tx.assets.create(id, admin, minBalance);
    const metadataTx = this.api.tx.assets.setMetadata(id, name, symbol, decimals);
    const txs = [createTx, metadataTx];

    if (team) {
      const teamTx = this.api.tx.assets.setTeam(id, team.issuer, team.admin, team.freezer);
      txs.push(teamTx);
    }
    const result = await this.signAndSend(this.api.tx.utility.batchAll(txs));

    return result.txHash.toHex();
  }

  async mint(id: number, beneficiary: string, amount: bigint) {
    const result = await this.signAndSend(this.api.tx.assets.mint(id, beneficiary, amount));

    return result.txHash.toHex();
  }

  async burn(id: number, who: string, amount: bigint) {
    const result = await this.signAndSend(this.api.tx.assets.burn(id, who, amount));

    return result.txHash.toHex();
  }

  async transfer(id: number, target: string, amount: bigint) {
    const result = await this.signAndSend(this.api.tx.assets.transfer(id, target, amount));

    return result.txHash.toHex();
  }

  async freeze(id: number, who: string) {
    const result = await this.signAndSend(this.api.tx.assets.freeze(id, who));

    return result.txHash.toHex();
  }

  async updateTeam(id: number, issuer: string, admin: string, freezer: string) {
    const result = await this.signAndSend(this.api.tx.assets.setTeam(id, issuer, admin, freezer));

    return result.txHash.toHex();
  }
  async updateMetadata(id: number, name: string, symbol: string, decimals: number) {
    const result = await this.signAndSend(
      this.api.tx.assets.setMetadata(id, name, symbol, decimals)
    );
    return result.txHash.toHex();
  }

  async thaw(id: number, who: string) {
    const result = await this.signAndSend(this.api.tx.assets.thaw(id, who));

    return result.txHash.toHex();
  }

  async freezeAsset(id: number) {
    const result = await this.signAndSend(this.api.tx.assets.freezeAsset(id));

    return result.txHash.toHex();
  }

  async thawAsset(id: number) {
    const result = await this.signAndSend(this.api.tx.assets.thawAsset(id));

    return result.txHash.toHex();
  }

  async transferOwnership(id: number, who: string) {
    const result = await this.signAndSend(this.api.tx.assets.transferOwnership(id, who));

    return result.txHash.toHex();
  }

  async revokeOwnership(id: number) {
    // create proxy
    const createPureProxyResult = await this.signAndSend(this.api.tx.proxy.createPure('Any', 0, 0));
    const pureEvent = createPureProxyResult.events.find(event =>
      this.api.events.proxy.PureCreated.is(event.event)
    );
    if (!pureEvent) {
      throw new Error('Failed to create pure proxy: PureCreated event not found.');
    }
    const pureProxyAddress = pureEvent.event.data['pure'].toString();
    const createPureProxyBlockNumber = createPureProxyResult.blockNumber?.toNumber() || 0;
    const createPureProxyBlocExtrinsicIndex = createPureProxyResult.txIndex || 0;

    // transfer asset ownership to proxy created above
    const result = await this.signAndSend(
      this.api.tx.utility.batchAll([
        this.api.tx.balances.transferKeepAlive(pureProxyAddress, 1000000000),
        this.api.tx.assets.setTeam(id, pureProxyAddress, pureProxyAddress, pureProxyAddress),
        this.api.tx.assets.transferOwnership(id, pureProxyAddress),
        this.api.tx.proxy.proxy(
          pureProxyAddress,
          'Any',
          this.api.tx.proxy.killPure(
            this.account.address,
            'Any',
            0,
            createPureProxyBlockNumber,
            createPureProxyBlocExtrinsicIndex
          )
        ),
      ])
    );

    return result.txHash.toHex();
  }
}
