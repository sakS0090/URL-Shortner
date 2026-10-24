const chars='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';


//passing in dbID to get a encoded string back
function encodingToString(num){

    if(num === 0)
    return chars[0];

    let result="";
    while(num>0)
{
   let rem=num%62;
   result=chars[rem]+result;
   num=Math.floor(num/62);
}
    return result;

}

function decodingToID(str)
{
     let id=0;
     for (let i = 0; i < str.length; i++) {
        let char = str[i];
        let charIndex = chars.indexOf(char);
    
        id = id * 62 + charIndex;
    }
    return id;
}

module.exports={
    encodingToString,
    decodingToID
}