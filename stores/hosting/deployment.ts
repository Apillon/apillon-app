import { defineStore } from 'pinia';

export const useDeploymentStore = defineStore('deployment', {
  state: () => ({
    active: {} as DeploymentInterface,
    loading: false,
    production: [] as DeploymentInterface[],
    staging: [] as DeploymentInterface[],
  }),
  getters: {
    hasProductionDeployments(state): boolean {
      return Array.isArray(state.production) && state.production.length > 0;
    },
    hasStagingDeployments(state): boolean {
      return Array.isArray(state.staging) && state.staging.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as DeploymentInterface;
      this.staging = [] as DeploymentInterface[];
      this.production = [] as DeploymentInterface[];
    },
    /**
     * Fetch wrappers
     */
    async getDeployments(
      websiteUuid: string,
      env: DeploymentEnvironment = DeploymentEnvironment.PRODUCTION
    ) {
      if (env === DeploymentEnvironment.PRODUCTION) {
        if (!this.hasProductionDeployments || isCacheExpired(LsCacheKeys.DEPLOYMENTS_PRODUCTION)) {
          return await this.fetchDeployments(websiteUuid, env);
        }
        return this.production;
      } else if (!this.hasStagingDeployments || isCacheExpired(LsCacheKeys.DEPLOYMENTS_STAGING)) {
        return await this.fetchDeployments(websiteUuid, env);
      }
      return this.staging;
    },

    /** Find bucket by ID, if bucket doesn't exists in store, fetch it */
    async getDeployment(websiteUuid: string, deploymentUuid: string): Promise<DeploymentInterface> {
      if (
        this.active?.deployment_uuid === deploymentUuid &&
        !isCacheExpired(LsCacheKeys.DEPLOYMENT)
      ) {
        return this.active;
      }
      return await this.fetchDeployment(websiteUuid, deploymentUuid);
    },

    /**
     * API calls
     */

    async fetchDeployments(
      websiteUuid: string,
      env: DeploymentEnvironment = DeploymentEnvironment.PRODUCTION
    ) {
      this.loading = true;
      try {
        const res = await $api.get<DeploymentsResponse>(endpoints.deployments(websiteUuid), {
          environment: env,
          orderBy: 'createTime',
          desc: 'true',
          ...PARAMS_ALL_ITEMS,
        });

        if (env === DeploymentEnvironment.PRODUCTION) {
          this.production = res.data.items;
        } else {
          this.staging = res.data.items;
        }

        /** Save timestamp to SS */
        const cacheKey =
          env === DeploymentEnvironment.PRODUCTION
            ? LsCacheKeys.DEPLOYMENTS_PRODUCTION
            : LsCacheKeys.DEPLOYMENTS_STAGING;
        sessionStorage.setItem(cacheKey, Date.now().toString());
      } catch (error: any) {
        if (env === DeploymentEnvironment.PRODUCTION) {
          this.production = [] as DeploymentInterface[];
        } else {
          this.staging = [] as DeploymentInterface[];
        }

        /** Show error message  */
        window.$message.error(userFriendlyMsg(error));
      }
      this.loading = false;
    },

    async fetchDeployment(
      websiteUuid: string,
      deploymentUuid: string
    ): Promise<DeploymentInterface> {
      try {
        const res = await $api.get<DeploymentResponse>(
          endpoints.deployment(websiteUuid, deploymentUuid)
        );

        this.active = res.data;

        /** Save timestamp to SS */
        sessionStorage.setItem(LsCacheKeys.DEPLOYMENT, Date.now().toString());

        return res.data;
      } catch (error: any) {
        this.active = {} as DeploymentInterface;

        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return {} as DeploymentInterface;
    },

    async deploy(
      websiteUuid: string,
      env: number = DeploymentEnvironment.STAGING
    ): Promise<DeploymentInterface | null> {
      try {
        const config = useRuntimeConfig();
        const params: Record<string, string | number | boolean | null> = {
          directDeploy: config.public.ENV === AppEnv.LOCAL,
          environment: env,
          website_uuid: websiteUuid,
        };
        const deployment = await $api.post<DeploymentResponse>(
          endpoints.websiteDeploy(websiteUuid),
          params
        );

        window.$message.success(window.$i18n.t('form.success.websiteDeploying'));
        return deployment.data;
      } catch (error: any) {
        /** Show error message */
        window.$message.error(userFriendlyMsg(error));
      }
      return null;
    },
  },
});
