const getFilteredArray = (arr, index) => {
  return arr.filter((_, i) => i !== index);
};

const getUpdatedArray = (arr, oldIndex, newIndex) => {
  if (newIndex > arr.length) return;

  const item = arr[oldIndex];
  const newArr = getFilteredArray(arr, oldIndex);

  if (newIndex === arr.length) {
    newArr.push(item);
  } else {
    newArr.splice(newIndex, 0, item);
  }

  return newArr;
};

module.exports = getUpdatedArray;
