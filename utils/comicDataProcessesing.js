export const processComicVineData = (data) => {
  const { description, id, name, cover_date, store_date } = data;
  const issue_number = '#' + data.issue_number;
  const image = data.image.medium_url;
  const title = data.volume.name;
  return {
    description,
    id,
    issue_number,
    name,
    title,
    image,
    cover_date,
    store_date,
  };
};

export const processMarvelData = (res) => {
  const { issueNumber, prices, series, images } = res;
  const title = series.name;
  const price = prices[0].price;
  const image = images[0].path + '.' + images[0].extension;
  const issue_number = '#' + issueNumber;
  const marvelData = {
    issue_number,
    price,
    title,
    image,
  };
  return marvelData;
};

export const comicTitleSplit = (comicTitle) => {
  let comicArr = [];
  for (let x = 0; x < comicTitle.length; x++) {
    if (comicTitle[x] === '#') {
      comicArr.push(comicTitle.substring(0, x - 1));
      let z = comicTitle.length - x;
      for (let y = 1; y <= z; y++) {
        if (comicTitle[x + y] === ' ' || comicTitle.length === x + y) {
          comicArr.push(comicTitle.substring(x + 1, x + y));
        }
      }
    }
  }
  return comicArr;
};
