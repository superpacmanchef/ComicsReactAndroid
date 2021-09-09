// Utility fuinctions for Comic Data

//Processes both APIs data to return same information.
export const processComicVineData = (data) => {
  const { description, id, name, cover_date, store_date } = data;
  const issue_number = "#" + data.issue_number;
  const image = data.image.medium_url;
  const title = data.volume ? data.volume.name : data.name;
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
  const image = images[0].path + "." + images[0].extension;
  const issue_number = "#" + issueNumber;
  const marvelData = {
    issue_number,
    price,
    title,
    image,
  };
  return marvelData;
};

//Splits comic title and issue NO String into Array
//(The Amazing Spider-Man #60) -> ["The Amazing Spider-Man" , "60"]
export const comicTitleSplit = (comicTitle) => {
  let comicArr = [];
  for (let x = 0; x < comicTitle.length; x++) {
    if (x === comicTitle.length - 1) {
      comicArr.push(comicTitle);
      comicArr.push("");
    }
    if (comicTitle[x] === "#") {
      comicArr.push(comicTitle.substring(0, x - 1));
      let z = comicTitle.length - x;
      for (let y = 1; y <= z; y++) {
        if (comicTitle[x + y] === " " || comicTitle.length === x + y) {
          comicArr.push(comicTitle.substring(x + 1, x + y));
        }
      }
    }
  }
  return comicArr;
};

export const alphSort = (comics) => {
  if (comics) {
    comics.sort(function (a, b) {
      if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return -1;
      }
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return 1;
      }
      return 0;
    });
  }
};

//Filters out comics based on publisher state and returns.
export const filterComicPublisher = (comics, publisher, pull) => {
  if (publisher === "ALL") {
    return comics;
  } else if (publisher === "PULL") {
    let f = [];
    comics.forEach((comic) => {
      for (let x = 0; x < pull.length; x++) {
        const comicTitle = comic.title
          .replace(/THE /g, "")
          .replace(/AND /g, "");

        let strippedPull = pull[x]
          .toUpperCase()
          .replace(/[.,#!$%&;:{}=`~()]/g, "")
          .replace(/AND /g, "")
          .replace(/THE /g, "");

        const [name] = comicTitleSplit(comicTitle);
        if (strippedPull === name) {
          f.push(comic);
        }
      }
    });
    return f;
  } else {
    let f = comics.filter((comic) => {
      return comic.publisher === publisher;
    });
    return f;
  }
};

//Filters out variants and trades and returns.
export const filterComicVarients = (comics) => {
  let filteredComics = [];
  comics.forEach((comic) => {
    if (
      comic.title.includes(" VAR") ||
      comic.title.includes(" CVR") ||
      comic.title.includes(" TP") ||
      comic.title.includes(" VOL") ||
      comic.title.includes(" OMNIBUS") ||
      comic.title.includes("COPY") ||
      comic.title.includes(" HC") ||
      comic.title.includes(" LTD ED") ||
      comic.title.includes(" COVER") ||
      comic.title.includes(" GN") ||
      comic.title.includes(" CV") ||
      comic.title.includes(" VA") ||
      comic.title.includes(" PTG") ||
      comic.title.includes(" PROG")
    ) {
    } else {
      filteredComics.push(comic);
    }
  });
  return filteredComics;
};
