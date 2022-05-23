// Add logging levels and make this actually useful by logging
export function warn(output: any){
    console.log('[WARNING]', output);
}

export function info(output: any){
    console.log('[INFO]', output);
}

export function error(output: any){
    console.log('[ERROR]', output);
}