import { useMessage } from 'naive-ui';
import { ServicesInterface, ServicesResponse } from '~~/types/service';

export async function getServices(projectId: number, type: number): Promise<ServicesInterface[]> {
  const params = {
    project_id: projectId,
    serviceType_id: type,
  };
  const { data, error } = await $api.get<ServicesResponse>(ServiceEndpoint.services, params);

  if (error) {
    const message = useMessage();
    message.error(error.message);
    return [];
  }

  if (data) {
    return data.data.items.map((service: ServicesInterface, key: number) => {
      return { key, ...service };
    });
  }
}
