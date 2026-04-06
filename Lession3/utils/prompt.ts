import promptSync from "prompt-sync";

const writeLine = promptSync();

export function write(str: string): string {
    return writeLine(str).trim();
}

export function writeNumber(str: string, start?: number, end?: number): number {
    const text = writeLine(str).trim();
    if (text === '') {
        return -1;
    }
    const number = Number(text);
    if (!isNaN(number)) {
        if ((start !== undefined && number < start) || (end !== undefined && number > end))
            return -1;
        else
            return number;
    } else return -1;
}

export function writeCheck(str: string, variable?: string): string {
    while (true) {
        const text: string = writeLine(str).trim();
        if (text === '') {
            console.log(`Không được bỏ trống ${variable ?? "ô nhập"}`);
            continue;
        }
        return text;
    }
}

export function writeNumberCheck(str: string, variable?: string, start?: number, end?: number): number {
    while (true) {
        const text = writeLine(str).trim();
        if (text === '') {
            console.log(`Không được bỏ trống ${variable}`);
            continue;
        }
        const number = Number(text);
        if (!isNaN(number)) {
            if ((start !== undefined && number < start) || (end !== undefined && number > end))
                continue;
            else return number;
        } else {
            console.log(`Không được nhập chữ cái vào ${variable}`);
            continue;
        }
    }
}