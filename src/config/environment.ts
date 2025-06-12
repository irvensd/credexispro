interface EnvironmentConfig {
  apiUrl: string;
  cdnUrl: string;
  environment: 'development' | 'staging' | 'production';
  enableMonitoring: boolean;
  enableLogging: boolean;
  cacheTTL: number;
  maxRetries: number;
  timeout: number;
}

const developmentConfig: EnvironmentConfig = {
  apiUrl: 'http://localhost:3000/api',
  cdnUrl: 'http://localhost:3000/static',
  environment: 'development',
  enableMonitoring: true,
  enableLogging: true,
  cacheTTL: 5 * 60 * 1000, // 5 minutes
  maxRetries: 3,
  timeout: 5000,
};

const stagingConfig: EnvironmentConfig = {
  apiUrl: 'https://staging-api.credexispro.com/api',
  cdnUrl: 'https://staging-cdn.credexispro.com',
  environment: 'staging',
  enableMonitoring: true,
  enableLogging: true,
  cacheTTL: 15 * 60 * 1000, // 15 minutes
  maxRetries: 3,
  timeout: 10000,
};

const productionConfig: EnvironmentConfig = {
  apiUrl: 'https://api.credexispro.com/api',
  cdnUrl: 'https://cdn.credexispro.com',
  environment: 'production',
  enableMonitoring: true,
  enableLogging: false, // Disable detailed logging in production
  cacheTTL: 30 * 60 * 1000, // 30 minutes
  maxRetries: 2,
  timeout: 15000,
};

const getEnvironmentConfig = (): EnvironmentConfig => {
  const env = process.env.NODE_ENV || 'development';

  switch (env) {
    case 'production':
      return productionConfig;
    case 'staging':
      return stagingConfig;
    default:
      return developmentConfig;
  }
};

export const environment = getEnvironmentConfig(); 