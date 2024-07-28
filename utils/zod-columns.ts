import { Column } from '@/types/column';
import * as z from 'zod';

export function buildZodSchema(columns: Column[]): z.ZodObject<any> {
  const schemaObj: { [key: string]: z.ZodTypeAny } = {};

  columns.forEach(column => {
    switch (column.type.toLowerCase()) {
      case 'string':
        schemaObj[column.name] = z.string();
        break;
      case 'number':
        schemaObj[column.name] = z.number();
        break;
      case 'boolean':
        schemaObj[column.name] = z.boolean();
        break;
      case 'date':
        schemaObj[column.name] = z.string().transform(val => new Date(val));
        break;
      default:
        schemaObj[column.name] = z.any();
    }
  });

  return z.object(schemaObj);
}