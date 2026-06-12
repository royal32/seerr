import type {
  TmdbMovieResult,
  TmdbPersonResult,
  TmdbTvResult,
} from '@server/api/themoviedb/interfaces';
import { mapSearchResults } from '@server/models/Search';
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

const movie: TmdbMovieResult = {
  id: 1,
  media_type: 'movie',
  title: 'Movie',
  original_title: 'Movie',
  release_date: '2026-01-01',
  adult: false,
  video: false,
  popularity: 1,
  vote_count: 1,
  vote_average: 1,
  genre_ids: [],
  overview: '',
  original_language: 'en',
};

const person: TmdbPersonResult = {
  id: 2,
  media_type: 'person',
  name: 'Actor',
  popularity: 1,
  adult: false,
  known_for: [],
};

const tv: TmdbTvResult = {
  id: 3,
  media_type: 'tv',
  name: 'TV Show',
  original_name: 'TV Show',
  origin_country: ['US'],
  first_air_date: '2026-01-01',
  popularity: 1,
  vote_count: 1,
  vote_average: 1,
  genre_ids: [],
  overview: '',
  original_language: 'en',
};

describe('mapSearchResults', () => {
  it('omits people from search results', () => {
    const results = mapSearchResults([movie, person, tv]);

    assert.deepStrictEqual(
      results.map((result) => result.mediaType),
      ['movie', 'tv']
    );
    assert.deepStrictEqual(
      results.map((result) => result.id),
      [movie.id, tv.id]
    );
  });
});
