<template>
  <div class="mb-8 mt-6 max-w-xl">
    <div class="mb-4">
      <h2 class="text-center">{{ $t('nft.collection.preview') }}</h2>
      <p>
        {{ $t('nft.collection.previewInfo') }}
      </p>
    </div>
    <div class="relative mb-4">
      <Image
        v-if="collectionStore.form.base.coverImage"
        :src="createThumbnailUrl(collectionStore.form.base.coverImage)"
        class="h-50"
      />
      <Image
        v-if="collectionStore.form.base.logo"
        :src="createThumbnailUrl(collectionStore.form.base.logo)"
        class="absolute left-2 top-2 h-20 border-2 border-bg-lighter"
      />
    </div>
    <n-table class="plain mb-6 table-fixed" :bordered="false" :single-line="true">
      <thead>
        <tr>
          <th>{{ $t('nft.collection.data') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('form.label.collection.name') }}:</td>
          <td>
            <span class="text-white">{{ collectionStore.form.base.name }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.symbol') }}:</td>
          <td>
            <span class="text-white">{{ collectionStore.form.base.symbol }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.chain') }}:</td>
          <td>
            <span class="text-white">{{ getChainName(collectionStore.form.behavior.chain) }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.chainType') }}:</td>
          <td>
            <span class="text-white">{{ ChainType[collectionStore.form.behavior.chainType] }}</span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.type') }}:</td>
          <td>
            <span class="text-white">
              {{ getCollectionTypeName(collectionStore.form.behavior.collectionType) }}
            </span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.useGateway') }}:</td>
          <td>
            <span class="text-white">
              {{
                collectionStore.form.behavior.useApillonIpfsGateway
                  ? $t('form.booleanSelect.true')
                  : $t('form.booleanSelect.false')
              }}
            </span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.useIpns') }}:</td>
          <td>
            <span class="text-white">
              {{
                collectionStore.form.behavior.useIpns ? $t('form.booleanSelect.true') : $t('form.booleanSelect.false')
              }}
            </span>
          </td>
        </tr>
      </tbody>
    </n-table>

    <n-table class="plain table-fixed" :bordered="false" :single-line="true">
      <thead>
        <tr>
          <th>{{ $t('nft.collection.behavior') }}</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ $t('form.label.collection.supplyLimited') }}:</td>
          <td>
            <span class="text-white">
              {{
                collectionStore.form.behavior.supplyLimited
                  ? collectionStore.form.behavior.maxSupply
                  : $t('form.supplyTypes.unlimited')
              }}
            </span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.revocable') }}:</td>
          <td>
            <span class="text-white">
              {{
                collectionStore.form.behavior.revocable ? $t('form.booleanSelect.true') : $t('form.booleanSelect.false')
              }}
            </span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.soulbound') }}:</td>
          <td>
            <span class="text-white">
              {{
                collectionStore.form.behavior.soulbound ? $t('form.booleanSelect.true') : $t('form.booleanSelect.false')
              }}
            </span>
          </td>
        </tr>
        <tr v-show="collectionStore.form.behavior.collectionType === NFTCollectionType.GENERIC">
          <td>{{ $t('form.label.collection.autoIncrement') }}:</td>
          <td>
            <span class="text-white">
              {{
                collectionStore.form.behavior.isAutoIncrement
                  ? $t('form.booleanSelect.true')
                  : $t('form.booleanSelect.false')
              }}
            </span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.royaltiesFees') }}:</td>
          <td>
            <span class="text-white">
              {{ collectionStore.form.behavior.royaltiesFees ? collectionStore.form.behavior.royaltiesFees : '0' }}
            </span>
          </td>
        </tr>
        <tr v-if="collectionStore.form.behavior.royaltiesAddress">
          <td>{{ $t('form.label.collection.royaltiesAddress') }}:</td>
          <td>
            <span class="text-white">
              {{ collectionStore.form.behavior.royaltiesAddress }}
            </span>
          </td>
        </tr>
        <tr>
          <td>{{ $t('form.label.collection.drop') }}:</td>
          <td>
            <span class="text-white">
              {{ collectionStore.form.behavior.drop ? $t('form.booleanSelect.true') : $t('form.booleanSelect.false') }}
            </span>
          </td>
        </tr>
        <template v-if="collectionStore.form.behavior.drop">
          <tr>
            <td>
              {{
                $t('form.label.collection.dropPrice', { currency: chainCurrency(collectionStore.form.behavior.chain) })
              }}:
            </td>
            <td>
              <span class="text-white"> {{ collectionStore.form.behavior.dropPrice }} </span>
            </td>
          </tr>
          <tr>
            <td>{{ $t('form.label.collection.dropStart') }}:</td>
            <td>
              <span class="text-white">
                {{ timestampToDateAndTime(collectionStore.form.behavior.dropStart / 1000) }}
              </span>
            </td>
          </tr>
          <tr>
            <td>{{ $t('form.label.collection.dropReserve') }}:</td>
            <td>
              <span class="text-white"> {{ collectionStore.form.behavior.dropReserve }} </span>
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>
  </div>
</template>

<script setup lang="ts">
import { ChainType, NFTCollectionType } from '~/lib/types/nft';
import { timestampToDateAndTime } from '~/lib/utils/dates';

const collectionStore = useCollectionStore();
const { collectionTypes, nftChains } = useCollection();
const { createThumbnailUrl } = useNft();

function getCollectionTypeName(collectionType: Number) {
  return collectionTypes.find(type => type.value === collectionType)?.label;
}
function getChainName(collectionChain: Number) {
  return nftChains.find(chain => chain.value === collectionChain)?.label;
}
</script>
