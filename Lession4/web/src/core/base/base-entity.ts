
import { v4 as uuidv4 } from 'uuid';
export default abstract class BaseEntity {
    id: string = uuidv4();
}