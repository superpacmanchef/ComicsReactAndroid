import Axios from "axios";
const link = "http://554c-82-20-31-7.ngrok.io";
import { comicTitleSplit } from "../utils/comicDataProcessesing";

//Gets users pullList and updates Pullist
export const getPull = async () => {
  const pullList = await Axios.get(`${link}/user/Pull`);
  if (pullList.status === 200) {
    return pullList.data;
  } else {
    return null;
  }
};
export const getCollection = async () => {
  const collectionRes = await Axios.post(`${link}/user/getCollection`);
  if (collectionRes.status === 200) {
    return collectionRes.data;
  } else {
    return null;
  }
};
export const getUsername = async () => {
  const usernameRes = await Axios.post(`${link}/user/getUsername`);
  if (usernameRes.status === 200) {
    return usernameRes.data;
  }
};

// export const checkPullList = async (comics: comics) => {
//   const comic = await Axios.post("user/checkPull", {
//     comicName: comics.title,
//   });
//   if (comic.status === 200) {
//     return comic.data.resp;
//   } else {
//     return null;
//   }
// };
export const checkPullList = (comic, pull) => {
  let comicsTitle;
  if (!comic.issue_number) {
    let [title] = comicTitleSplit(comic.title);
    comicsTitle = title;
  } else {
    comicsTitle = comic.title;
  }

  let pulFlag = 2;
  for (let x = 0; x < pull.length; x++) {
    if (comicsTitle) {
      console.log(comicsTitle.toUpperCase());
      if (
        pull[x]
          .toUpperCase()
          .replace(/[.,#!$%;{}=`~()]/g, "")
          .replace(/AND /g, "")
          .replace(/THE /g, "") ===
        comicsTitle.replace(/THE /g, "").replace(/The /g, "").toUpperCase()
      ) {
        pulFlag = 4;
      }
    }
  }
  return pulFlag;
};
export const checkCollection = (comic, collection) => {
  let exist = 1;
  if (comic.id) {
    collection.forEach((collectionComic) => {
      if (collectionComic.id === comic.id) {
        exist = 3;
      }
    });
  } else {
    collection.forEach((collectionComic) => {
      if (collectionComic.diamond_id === comic.diamond_id) {
        exist = 3;
      }
    });
  }
  return exist;
};

export const insertCollection = async (res) => {
  const colRes = await Axios.post(`${link}/user/insertCollection`, {
    comic: res,
  });
  if (colRes.status === 200) {
    return colRes.data;
  } else {
    return false;
  }
};
export const removeCollection = async (res) => {
  const colRes = await Axios.post(`${link}/user/removeCollection`, {
    comicName: res.title,
    comicIssue: res.issue_number,
  });
  if (colRes.status === 200) {
    return colRes.data;
  } else {
    return false;
  }
};

export const insertPullList = async (name) => {
  const res = await Axios.post(`${link}/user/AddPull`, { comicName: name });
  if (res.status === 200) {
    return res.data.comic;
  } else {
    return false;
  }
};
export const removePullList = async (comicName) => {
  const res = await Axios.post(`${link}/user/removePull`, {
    comicName: comicName,
  });
  if (res.status === 200) {
    return res.data;
  } else {
    return false;
  }
};

export const login = (username, password) => {
  return Axios.post(`${link}/user/Login`, {
    username,
    password,
  }).then((loged) => {
    if (loged.data) {
      return true;
    } else {
      return false;
    }
  });
};

export const reg = (username, password, passwordR, email) => {
  Axios.post(`${link}/user/Register`, {
    username,
    password,
    passwordRepeat: passwordR,
    email,
  }).then((res) => {
    if (res.data === true) {
      alert(`This username is already taken`);
    } else if (res.data === false) {
      alert(`Account Created`);
    } else if (res.data === 2) {
      alert(`Passwords do not match`);
    }
  });
};

export const getLoged = async () => {
  const loged = await Axios.get("/user/Loged");
  if (loged.status === 200) {
    return loged.data;
  } else {
    return false;
  }
};
