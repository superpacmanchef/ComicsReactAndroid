import Axios from "axios";
const link = "http://554c-82-20-31-7.ngrok.io";

/////////////COMICVINE ... MARVELAPI ////////////
//Takes in indivial comic and returns Cover
export const getImages = async (comic) => {
  if (comic.publisher === "MARVEL COMICS") {
    const res = await Axios.post(`${link}/api/MarvelImg`, {
      comicID: comic.diamond_id,
    });
    if (res) {
      try {
        return res.data.images[0].path + "." + res.data.images[0].extension;
      } catch (e) {
        return "http://placecorgi.com/416/640";
      }
    } else {
      return "http://placecorgi.com/416/640";
    }
  } else {
    const res = await Axios.post(`${link}/api/ComicImg`, {
      comicName: comic.title,
    });
    return res.data[0].image.small_url;
  }
};
export const getComicData = async (
  comicID,
  comicName,
  comicDate,
  comicTitle
) => {
  const comicRes = await Axios.post(`${link}/api/ComicVineQuery`, {
    comicName: comicName,
    comicID: comicID,
    comicDate: comicDate,
    comicTitle: comicTitle,
  });
  if (comicRes.status === 200) {
    return comicRes.data.results[0];
  } else {
    return false;
  }
};
export const getMarvelData = async (comicID) => {
  const marvelRes = await Axios.post(`${link}/api/MarvelQuery`, {
    comicID: comicID,
  });
  if (marvelRes.status === 200) {
    return marvelRes.data.data.results[0];
  } else {
    return false;
  }
};

/////////////SHORTBOXEDAPI////////////
//Returns Selected Weeks Comic Array from API
export const getComics = (week) => {
  return Axios.post(`${link}/api/NewComics`, {
    week,
  })
    .then((comicsResponse) => {
      let comics = comicsResponse.data.comics;
      if (comics !== undefined) {
        return comics;
      } else {
        return [];
      }
    })
    .catch((err) => {
      console.log(err);
      return [];
    });
};

export default { getComics, getImages, getComicData, getMarvelData };
