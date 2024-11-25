export default function createUniqueIdGenerator() {
    let counter = 0;
  
    return function() {
      counter += 1;
      return `id_${counter}`;
    };
  }
  