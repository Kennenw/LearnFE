//1. Write the function to calculate the combination (Cnk)
function nCk(n, k){
    if(k > n) return 0;
    if(k === 0 || k === n) {
        return 1;
    }
    return nCk(n-1,k-1) + nCk(n-1,k);
}
console.log(nCk(10, 2));
//2. Write the function to get a random integer between 2 numbers: min, max;
function randomBetween(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min);
}
//console.log(randomBetween(1, 10));

//3. Write the function get a random element from an arrays.
function randomElement(arr){
    if(arr.length === 0) return [];
    return arr[Math.floor(Math.random() * arr.length)];
}
const colors = ["red", "green", "blue"];
console.log(randomElement(colors)); 

//4. Given two arrays of integers, 
//find which elements in the second array are missing from the first array.
function findElements(arr1, arr2){
    if(arr1.length === 0) return arr2;
    if (arr2.length === 0) return [];
    const set1 = new Set(arr1);
    return arr2.filter(e => !set1.has(e));
}
const arr1 = [2, 4];
const arr2 = [1, 2, 3, 4, 5];
console.log(findElements(arr1, arr2));
