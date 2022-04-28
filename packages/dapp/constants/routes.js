export const BASE_PATH = '/';
export const HOME_PATH = '/#home';
export const ABOUT_PATH = '/#about';
export const DONATE_PATH = '/#donate';
export const GALLERY_ALL_PATH = '/gallery/';
export const GALLERY_ME_PATH = '/gallery/me/';

export const GALLERY_ROUTES = {
  all: {
    path: GALLERY_ALL_PATH,
    text: "All NFT's",
  },
  me: {
    path: GALLERY_ME_PATH,
    text: 'Owned by me',
  },
};

export const MAIN_ROUTES = {
  home: {
    path: HOME_PATH,
    text: 'Home',
    menuanchor: 'home',
  },
  about: {
    path: ABOUT_PATH,
    text: 'About us',
    menuanchor: 'about',
  },
  donate: {
    path: DONATE_PATH,
    text: 'Donate',
    menuanchor: 'donate',
  },
  gallery: {
    path: GALLERY_ALL_PATH,
    text: 'Gallery',
    menuanchor: 'gallery',
  },
};
