import { Request, Response, NextFunction } from 'express';
import logger from '../shared/logger';


const parseJsonString = (value: string): any => {
    if (value === '[object Object]') {
        return undefined; // Treat as invalid input for an object
    }
    try {
        const parsed = JSON.parse(value);
        // If it's a valid JSON array or object, return it
        if (typeof parsed === 'object' && parsed !== null) {
            return parsed;
        }
    } catch {
        // Not a valid JSON string
    }

    // If it's a string that contains commas, treat it as a comma-separated array
    // This handles cases where arrays are sent as "item1,item2,item3"
    if (value.includes(',')) {
        return value.split(',').map(item => item.trim());
    }

    return value;
};

const processObject = (obj: Record<string, any> | any[]): Record<string, any> | any[] => {
    if (Array.isArray(obj)) {
        return obj.map(item => {
            if (typeof item === 'string') {
                return parseJsonString(item);
            } else if (item && typeof item === 'object') {
                return processObject(item);
            }
            return item;
        });
    }

    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(obj)) {
        if (typeof value === 'string') {
            result[key] = parseJsonString(value);
        } else if (value && typeof value === 'object') {
            result[key] = processObject(value);
        } else {
            result[key] = value;
        }
    }

    return result;
};

const formDataToJson = (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.body) {
            console.log('Parsed body:', req.body);
            if (typeof req.body === 'string') {
                req.body = parseJsonString(req.body);
                
            } else if (typeof req.body === 'object') {
                req.body = processObject(req.body);
            }
            console.log('Transformed body:', JSON.stringify(req.body, null, 2));
        }

    } catch (error: any) {
        logger.error("Failed to convert form data to json", {
            path: req.originalUrl,
            method: req.method,
            ip: req.ip,
            userId: req.user?.id || 'unauthenticated',
            stack: error?.stack,
            errorMessages: error.errorMessages,
            keyValue: error.keyValue,
            code: error.code
        })

    }
    next();
};

export default formDataToJson;