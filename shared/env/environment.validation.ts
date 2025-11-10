import * as Joi from 'joi';

export const environmentValidationSchema = Joi.object({
	NODE_ENV: Joi.string().valid('development', 'production', 'test').default('development'),
	PORT: Joi.number().default(3000),
	DATABASE_URL: Joi.string().required(),
	RABBITMQ_URL: Joi.string().required(),
	NOTIFICATION_DELAY_MS: Joi.number().default(86400000),
	EXTERNAL_API_URL: Joi.string().uri().required(),
	LOG_LEVEL: Joi.string().valid('debug', 'info', 'warn', 'error').default('info'),
});
