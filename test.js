function findRepeatStr(str) {
    const arr = str.split('')
    let max = 0
    let target = null
    for (let i = 0; i < arr.length - 1; i++) {
      const curChar = arr[i]
      let size = 0

    //   // 方案一
    //   for (let j = i; j < arr.length; j++) {
    //     if (arr[j] === curChar) {
    //       size++
    //     } else {
    //       if (max < size) {
    //         target = curChar
    //         max = size
    //         break
    //       }
    //     }
    //   }

      // 方案二
      const targetIndex = arr.slice(i).findIndex((item) => item !== curChar) + i + 1
      if (targetIndex === -1) {
        size = arr.length - i + 1
      } else {
        size = targetIndex - i - 1
      }
      
      if (max < size) {
        target = curChar
        max = size
      }
    }

    
    console.log('max', max)
    const start = arr.findIndex((item) => item === target)
    return {
      char: target,
      startIndex: start,
      endIndex: start + max - 1
    }
  }
const str = 'abcdefggghhhhiiijjjj';
console.log(findRepeatStr(str)); // 输出 {char: 'h', startIndex: 9, endIndex: 12}