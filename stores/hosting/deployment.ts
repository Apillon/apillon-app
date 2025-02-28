import { defineStore } from 'pinia';

export const useDeploymentStore = defineStore('deployment', {
  state: () => ({
    active: {} as DeploymentInterface,
    loading: false,
    buildsLoading: false,
    builds: [] as DeploymentBuildInterface[],
    buildWebsiteUuid: '',
    variables: [] as DeploymentConfigVariable[],
    variableForm: {} as DeploymentConfigVariable & {
      prevKey?: string;
    },
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
    hasBuildsLoaded(state): boolean {
      return Array.isArray(state.builds) && state.builds.length > 0;
    },
    hasVariablesLoaded(state): boolean {
      return Array.isArray(state.variables) && state.variables.length > 0;
    },
  },
  actions: {
    resetData() {
      this.active = {} as DeploymentInterface;
      this.staging = [] as DeploymentInterface[];
      this.production = [] as DeploymentInterface[];
      this.variables = [] as DeploymentConfigVariable[];
    },
    revertVariableChanges() {
      this.variableForm = {
        key: '',
        value: '',
        prevKey: undefined,
      };
    },
    /**
     * Fetch wrappers
     */
    async getDeployments(websiteUuid: string, env: DeploymentEnvironment = DeploymentEnvironment.PRODUCTION) {
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
      if (this.active?.deployment_uuid === deploymentUuid && !isCacheExpired(LsCacheKeys.DEPLOYMENT)) {
        return this.active;
      }
      return await this.fetchDeployment(websiteUuid, deploymentUuid);
    },

    async getBuilds(websiteUuid: string) {
      if (
        !this.hasBuildsLoaded ||
        isCacheExpired(LsCacheKeys.DEPLOYMENT_BUILD) ||
        this.buildWebsiteUuid !== websiteUuid
      ) {
        await this.fetchBuilds(websiteUuid);
      }
    },

    async getVariables(deploymentConfigId: number) {
      if (!this.hasVariablesLoaded || isCacheExpired(LsCacheKeys.DEPLOYMENT_VARIABLES)) {
        await this.fetchVariables(deploymentConfigId);
      }
    },

    /**
     * API calls
     */

    async fetchDeployments(websiteUuid: string, env: DeploymentEnvironment = DeploymentEnvironment.PRODUCTION) {
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

    async fetchVariables(deploymentConfigId: number) {
      this.loading = true;

      try {
        const res = await $api.get<DeploymentConfigVariablesResponse>(
          endpoints.deploymentConfigVariables(deploymentConfigId)
        );

        this.variables = res.data;

        sessionStorage.setItem(LsCacheKeys.DEPLOYMENT_VARIABLES, Date.now().toString());
      } catch (error: any) {
        this.variables = [] as DeploymentConfigVariable[];
        window.$message.error(userFriendlyMsg(error));
      }

      this.loading = false;
    },
    async fetchBuilds(websiteUuid: string) {
      this.buildsLoading = true;

      try {
        const res = await $api.get<DeploymentBuildsResponse>(endpoints.deploymentBuilds, {
          orderBy: 'createTime',
          desc: 'true',
          ...PARAMS_ALL_ITEMS,
          websiteUuid,
        });

        this.builds = res.data.items;

        this.buildWebsiteUuid = websiteUuid;

        sessionStorage.setItem(LsCacheKeys.DEPLOYMENT_BUILD, Date.now().toString());
      } catch (error) {
        this.builds = [] as DeploymentBuildInterface[];
        window.$message.error(userFriendlyMsg(error));
      }

      this.buildsLoading = false;
    },

    async fetchDeployment(websiteUuid: string, deploymentUuid: string): Promise<DeploymentInterface> {
      try {
        const res = await $api.get<DeploymentResponse>(endpoints.deployment(websiteUuid, deploymentUuid));

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

    async saveVariables(deploymentConfigId: number) {
      try {
        if (this.variableForm.key) {
          if (this.variableForm.prevKey) {
            const index = this.variables.findIndex(v => v.key === this.variableForm.prevKey);
            this.variables[index] = {
              key: this.variableForm.key,
              value: this.variableForm.value,
            };
          } else {
            this.variables.push(this.variableForm);
          }
        }

        await $api.post<DeploymentConfigResponse>(endpoints.deploymentConfigVariables(), {
          variables: this.variables,
          deploymentConfigId,
        });

        window.$message.success(window.$i18n.t('hosting.deploy.env-vars.success-save'));
      } catch (error: any) {
        window.$message.error(userFriendlyMsg(error));
      }

      this.revertVariableChanges();
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
        const deployment = await $api.post<DeploymentResponse>(endpoints.websiteDeploy(websiteUuid), params);

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
