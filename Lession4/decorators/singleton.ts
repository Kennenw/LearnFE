export function Singleton<T extends {new ( ...args: any[]): any}>(constructor: T){
    let instance: any;
    let count: number = 1;
    return class extends constructor {
        constructor(...args: any[]){
            super(...args);
            if(instance){
                console.log(`Check count: ${count + 1}`);
                return instance;
            }
            instance = this;
        }
    }
} 

