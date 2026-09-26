import type { Track } from "../types/media";

export const musicLibrary: Track[] = [
  {
    id: "metallica-fuel",
    title: "Fuel",
    artist: "Metallica",
    album: "Reload",

    audio:
      "/music/songs/Fuel (Remastered).mp3",

    cover:
      "/music/covers/queen.jpg",

    duration: 0,

    source: "local",
  },

  {
    id: "eagles-hotel-california",
    title: "Hotel California",
    artist: "Eagles",
    album: "Hotel California",

    audio:
      "/music/songs/hotel-california.mp3",

    cover:
      "/music/covers/eagles.jpg",

    duration: 0,

    source: "local",
  },

  {
    id: "foo-everlong",
    title: "Everlong",
    artist: "Foo Fighters",
    album: "The Colour and the Shape",

    audio:
      "/music/songs/everlong.mp3",

    cover:
      "/music/covers/foo-fighters.jpg",

    duration: 0,

    source: "local",
  },

  {
    id: "acdc-back-in-black",
    title: "Back in Black",
    artist: "AC/DC",
    album: "Back in Black",

    audio:
      "/music/songs/back-in-black.mp3",

    cover:
      "/music/covers/acdc.jpg",

    duration: 0,

    source: "local",
  },
];