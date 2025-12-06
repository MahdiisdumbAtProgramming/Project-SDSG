const __OBFUSCATED_CODE='PAPD9792';window.Deobf=(function(){function _shiftChar(ch,shift){const c=ch.charCodeAt(0);if(c>=65&&c<=90){const base=65;return String.fromCharCode(((c-base+shift)%26+26)%26+base)}
if(c>=97&&c<=122){const base=97;return String.fromCharCode(((c-base+shift)%26+26)%26+base)}
if(c>=48&&c<=57){const base=48;return String.fromCharCode(((c-base+shift)%10+10)%10+base)}
return ch}
function _transform(str,shift){return str.split('').map(ch=>_shiftChar(ch,shift)).join('')}
const api={getDecodedCode:function(){try{return _transform(__OBFUSCATED_CODE,+3)}catch(e){return null}},_getObf:function(){return __OBFUSCATED_CODE},_transform:_transform};return api})()