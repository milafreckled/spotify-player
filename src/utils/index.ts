export function shuffle(array: Array<any>) {
    let curIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (curIndex !== 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * curIndex);
      curIndex--;
  
      // And swap it with the current element.
      [array[curIndex], array[randomIndex]] = [
        array[randomIndex], array[curIndex]];
    }
  
    return array;
  }
  export function msConverter(ms: any){
    const inMinutes = ms / 60;
    const intPart = (Math.floor(inMinutes));
    const floatPart = (ms - (60 * intPart)) >= 10 ? (ms - (60 * intPart)).toFixed(0) : ('0' + (ms - (60 * intPart)).toFixed(0));
    return [intPart.toString(), floatPart];
}