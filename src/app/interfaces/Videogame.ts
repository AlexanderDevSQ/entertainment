import { Personal } from "./Anime";


export interface Cover {
  id: number;
  url: string;
}

export interface Genre {
  id : string;
  name:string;
}

export interface Video {
  id : string;
  video_id : string;
}

export interface Videogame {
  id:                  number;
  alternative_names:   number[];
  artworks:            number[];
  category:            number;
  cover:               Cover;
  created_at:          number;
  external_games:      number[];
  first_release_date:  number;
  game_modes:          number[];
  genres:              Genre[];
  hypes:               number;
  involved_companies:  number[];
  keywords:            number[];
  name:                string;
  platforms:           number[];
  player_perspectives: number[];
  rating:              number;
  rating_count:        number;
  release_dates:       number[];
  screenshots:         number[];
  similar_games:       number[];
  slug:                string;
  storyline:           string;
  summary:             string;
  tags:                number[];
  themes:              number[];
  total_rating:        number;
  total_rating_count:  number;
  updated_at:          number;
  url:                 string;
  videos:              Video[];
  websites:            number[];
  checksum:            string;
  language_supports:   number[];
  game_localizations:  number[];
  game_type:           number;
  isSaved?: boolean;
  personal?: Personal;
}
