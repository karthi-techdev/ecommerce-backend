interface Config {
    jwt: {
        secret: string;
        accessTokenExpiration: string;
        refreshTokenExpiration: string;
    };
    environment: string;
}

class ConfigValidator {
    private config: Config;

    constructor() {
        this.validateEnvironmentVariables();
        this.config = {
            jwt: {
                secret: this.getJWTSecret(),
                accessTokenExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
                refreshTokenExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d'
            },
            environment: process.env.NODE_ENV || 'development'
        };
    }

    private validateEnvironmentVariables(): void {
        const requiredEnvVars = [
            'JWT_SECRET',
            'NODE_ENV'
        ];

        const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);
        if (missingEnvVars.length > 0) {
            throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
        }
    }

    private getJWTSecret(): string {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('JWT_SECRET environment variable is required');
        }
        if (secret.length < 32) {
            throw new Error('JWT_SECRET must be at least 32 characters long');
        }
        return secret;
    }

    public getConfig(): Config {
        return this.config;
    }
}

export const configValidator = new ConfigValidator();
export default configValidator.getConfig();