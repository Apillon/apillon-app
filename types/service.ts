/**
 * Service ENUM
 */
enum ServiceType {
  AUTHENTICATION = 1,
  STORAGE = 2,
  COPMUTING = 3,
}

/**
 * Service Type
 */
interface ServiceTypeInterface {
  id: number;
  name: string;
  description: string;
  active: number;
  status: number;
}
interface ServiceTypeItem {
  id: number;
  name: string;
  icon: string;
  new?: boolean | null;
  disabled?: boolean | null;
}

/**
 * Service
 */
interface ServicesInterface {
  name: string;
  serviceType: string;
  active: number;
  uptime: string;
}

interface ServicesResponse {
  data: {
    items: ServicesInterface[];
    total: number;
  };
  status: number;
}

interface FormService {
  serviceName: string;
  networkType: boolean;
}
interface CreateServiceResponse {
  data: {
    id: number;
    status: number;
  };
  status: number;
}

/**
 * Export all
 */
export {
  ServiceType,
  ServiceTypeInterface,
  ServiceTypeItem,
  ServicesInterface,
  ServicesResponse,
  FormService,
  CreateServiceResponse,
};
