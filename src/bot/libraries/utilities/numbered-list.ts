export function numberedList(array: any[], prop: any) {
    let response = '';
    for (let i = 0; i < array.length; i++) {
        let val = prop ? array[i][prop] : array[i];
        response += `。[**${i + 1}**]　→　\'*${val}*\'\n`
    }
    return response;
}