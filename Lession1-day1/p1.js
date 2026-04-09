// 1. Write a function to format money string
function formatMoney(n){
    return n.toLocaleString();
}
console.log(formatMoney(10000000000));

// 2. Write a function for format money in shorten
function formatMoneyInShorten(n){
    if(n < 0) return n.toString();
    const enums = [{
        value: 1000000000, 
        digits: "B", 
    },{
        value: 1000000, 
        digits: "M", 
    },{
        value: 1000, 
        digits: "K", 
    }]
    for(let i of enums){
        if(n >= i.value)
            return  Number(n/i.value).toFixed(2) + i.digits;
    }
    return n.toString();
}
console.log(formatMoneyInShorten(1342222));

//3. Write the function to count how many words appear in a string
function countWords(str){
    str = String(str || "").trim();
    return (str.trim().match(/[A-Z]?[a-z]+|\p{L}+/gu) || []).length;
}
console.log(countWords("oneTwo three"));
console.log(countWords(-1));

//4. Write the function get the get the Extension of file
function getExtensionOfFile(str){
    str = String(str || "").trim();
    return str.trim().slice(str.lastIndexOf(".") + 1) || null;
}
console.log(getExtensionOfFile(""));