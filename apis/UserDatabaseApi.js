import Axios from "axios";
const link = "http://696ad6915651.ngrok.io";

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
  }
};
export const getUsername = async () => {
  const usernameRes = await Axios.post(`${link}/user/getUsername`);
  if (usernameRes.status === 200) {
    return usernameRes.data;
  }
};

export const checkPullList = async (comics) => {
  const comic = await Axios.post(`${link}/user/checkPull`, {
    comicName: comics.title,
  });
  if (comic.status == 200) {
    return comic.data.resp;
  } else {
    return null;
  }
};
export const checkCollection = async (comics) => {
  const comic = await Axios.post(`${link}/user/checkCollection`, {
    comicName: comics.title,
    comicId: comics.diamond_id,
  });
  if (comic.status == 200) {
    return comic.data.resp;
  } else {
    return null;
  }
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
  }
};

export const insertPullList = async (name) => {
  const res = await Axios.post(`${link}/user/AddPull`, { comicName: name });
  if (res.status === 200) {
    return res.data.comic;
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
    if (!loged.data) {
      return "false";
    } else {
      return "true";
    }
  });
};

export const getLoged = async () => {
  const loged = await Axios.get(`${link}/user/Loged`);
  return loged;
};
