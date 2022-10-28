import { useMessage } from 'naive-ui';
import { ProjectInterface, ProjectResponse } from '~~/types/data';
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

  return data.data.items.map((service: ServicesInterface, key: number) => {
    return { key, ...service };
  });
}

export async function getProjects(): Promise<ProjectInterface[]> {
  const { data, error } = await $api.get<ProjectResponse>(ProjectEndpoint.project);

  if (error) {
    const message = useMessage();
    message.error(error.message);
  }
  return data.data.items.map((project: ProjectInterface) => {
    return {
      ...project,
      value: project.id,
      label: project.name,
    };
  });
}
