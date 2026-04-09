//1. convert to Roman number: n integer < 1,000
function convertToRomanNumber(n) {
    const rules = {
        M: 1000, CM: 900, D: 500, CD: 400,
        C: 100, XC: 90, L: 50, XL: 40,
        X: 10, IX: 9, V: 5, IV: 4, I: 1
    };
    let result = ""
    for (let key in rules) {
        while (n >= rules[key]) {
            result += key;
            n -= rules[key];
        }
    }
    return result;
}
console.log(convertToRomanNumber(10));

// 2. print how to read number in vietnamese: n integer < 1,000,000
function readNumber(num) {
    let result = "";
    const number = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín"]

    function read(n) {
        if (n === 0) return "";
        let rs = "";
        let thousand = Math.floor(n / 1000);
        let hundred = Math.floor(n % 1000 / 100);
        let ten = Math.floor(n % 100 / 10);
        let unit = n % 10;
        if (thousand !== 0)
            rs += number[thousand] + " ngàn";

        if (hundred !== 0 || ((ten !== 0 || unit != 0) && thousand !== 0))
            rs += " " + number[hundred] + " trăm";

        if (ten !== 0) {
            if (ten === 1) rs += " mười";
            else rs += " " + number[ten] + " mươi";
        } else if (unit !== 0 && (thousand !== 0 || hundred !== 0)) {
            rs += " linh";
        }

        if (unit !== 0) {
            if (ten >= 2 && unit === 1) rs += " mốt";
            else if (ten >= 2 && unit === 4) rs += " tư";
            else if (ten >= 1 && unit === 5) rs += " lăm";
            else rs += " " + number[unit];
        }
        return rs.trim();
    }
    let first = Math.floor(num / 10000);
    let last = num % 10000;
    if (first) {
        result += read(first) + " vạn ";
    }
    result += read(last);
    return result;
}