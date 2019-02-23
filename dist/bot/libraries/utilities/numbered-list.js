"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function numberedList(array, prop) {
    let response = '';
    for (let i = 0; i < array.length; i++) {
        let val = prop ? array[i][prop] : array[i];
        response += `。[**${i + 1}**]　→　\'*${val}*\'\n`;
    }
    return response;
}
exports.numberedList = numberedList;
//# sourceMappingURL=numbered-list.js.map