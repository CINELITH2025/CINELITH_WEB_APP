#!/usr/bin/env python3
"""Build item-based cosine KNN neighbors from the TMDB/MovieLens archive.

Mirrors untitled0.py:
  pivot ratings (movie x user), drop movies with <=10 ratings and users with
  <=30 ratings, cosine KNN, recommend nearest titles.
"""

from __future__ import annotations

import ast
import csv
import json
import math
import os
from collections import defaultdict
from pathlib import Path

csv.field_size_limit(10_000_000)

ARCHIVE = Path(os.environ.get(
    "CINELITH_MOVIE_ARCHIVE",
    str(Path.home() / "Downloads" / "archive (1)"),
))
OUT_DIR = Path(__file__).resolve().parent.parent / "data"
NEIGHBORS_PER_MOVIE = 15
MIN_MOVIE_RATINGS = 10
MIN_USER_RATINGS = 30


def load_ratings(path: Path):
    ratings = []
    movie_counts = defaultdict(int)
    user_counts = defaultdict(int)
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            try:
                movie_id = int(row["movieId"])
                user_id = int(row["userId"])
                rating = float(row["rating"])
            except (TypeError, ValueError):
                continue
            ratings.append((user_id, movie_id, rating))
            movie_counts[movie_id] += 1
            user_counts[user_id] += 1
    keep_movies = {mid for mid, count in movie_counts.items() if count > MIN_MOVIE_RATINGS}
    keep_users = {uid for uid, count in user_counts.items() if count > MIN_USER_RATINGS}
    filtered = [
        (uid, mid, rating)
        for uid, mid, rating in ratings
        if mid in keep_movies and uid in keep_users
    ]
    return filtered


def load_links(path: Path):
    mapping = {}
    with path.open(newline="", encoding="utf-8") as handle:
        for row in csv.DictReader(handle):
            try:
                movie_id = int(row["movieId"])
            except (TypeError, ValueError):
                continue
            tmdb_raw = (row.get("tmdbId") or "").strip()
            mapping[movie_id] = int(float(tmdb_raw)) if tmdb_raw else None
    return mapping


def parse_genres(raw: str):
    if not raw:
        return []
    try:
        parsed = ast.literal_eval(raw)
        if isinstance(parsed, list):
            return [item.get("name") for item in parsed if isinstance(item, dict) and item.get("name")]
    except (ValueError, SyntaxError):
        pass
    return []


def load_metadata(path: Path):
    meta = {}
    with path.open(newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        for row in reader:
            try:
                tmdb_id = int(row["id"])
            except (TypeError, ValueError):
                continue
            title = (row.get("title") or row.get("original_title") or "").strip()
            if not title:
                continue
            release = (row.get("release_date") or "")[:4]
            poster = (row.get("poster_path") or "").strip()
            meta[tmdb_id] = {
                "title": title,
                "year": release if release.isdigit() else "",
                "overview": (row.get("overview") or "").strip(),
                "poster": f"https://image.tmdb.org/t/p/w342{poster}" if poster else "",
                "genres": parse_genres(row.get("genres") or ""),
            }
    return meta


def build_sparse(ratings):
    vectors = defaultdict(dict)
    for user_id, movie_id, rating in ratings:
        vectors[movie_id][user_id] = rating
    norms = {
        movie_id: math.sqrt(sum(value * value for value in users.values())) or 1.0
        for movie_id, users in vectors.items()
    }
    return vectors, norms


def top_neighbors(vectors, norms, k):
    movie_ids = list(vectors)
    by_user = defaultdict(list)
    for movie_id, users in vectors.items():
        for user_id, rating in users.items():
            by_user[user_id].append((movie_id, rating))

    dots = defaultdict(lambda: defaultdict(float))
    for pairs in by_user.values():
        if len(pairs) < 2:
            continue
        for i, (left_id, left_rating) in enumerate(pairs):
            for right_id, right_rating in pairs[i + 1 :]:
                score = left_rating * right_rating
                dots[left_id][right_id] += score
                dots[right_id][left_id] += score

    neighbors = {}
    for movie_id in movie_ids:
        ranked = []
        for other_id, dot in dots[movie_id].items():
            cosine = dot / (norms[movie_id] * norms[other_id])
            distance = 1.0 - cosine
            ranked.append((distance, other_id))
        ranked.sort(key=lambda item: item[0])
        neighbors[movie_id] = ranked[:k]
    return neighbors


def main():
    ratings_path = ARCHIVE / "ratings_small.csv"
    links_path = ARCHIVE / "links_small.csv"
    meta_path = ARCHIVE / "movies_metadata.csv"
    if not ratings_path.exists():
        raise SystemExit(f"Missing dataset at {ARCHIVE}")

    print(f"Loading ratings from {ratings_path}")
    ratings = load_ratings(ratings_path)
    print(f"Filtered ratings: {len(ratings)}")

    links = load_links(links_path)
    metadata = load_metadata(meta_path)

    vectors, norms = build_sparse(ratings)
    print(f"Movies in model: {len(vectors)}")
    neighbors_raw = top_neighbors(vectors, norms, NEIGHBORS_PER_MOVIE)

    catalog = []
    neighbors = {}
    for movie_id in sorted(vectors):
        tmdb_id = links.get(movie_id)
        info = metadata.get(tmdb_id) if tmdb_id else None
        title = info["title"] if info else f"Movie {movie_id}"
        record = {
            "movieId": movie_id,
            "tmdbId": tmdb_id,
            "title": title,
            "year": info["year"] if info else "",
            "overview": info["overview"] if info else "",
            "poster": info["poster"] if info else "",
            "genres": info["genres"] if info else [],
        }
        catalog.append(record)
        neighbors[str(movie_id)] = [
            {"movieId": other_id, "distance": round(distance, 6)}
            for distance, other_id in neighbors_raw.get(movie_id, [])
        ]

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    payload = {
        "algorithm": "item-knn-cosine",
        "source": "ratings_small.csv + movies_metadata.csv",
        "minMovieRatings": MIN_MOVIE_RATINGS,
        "minUserRatings": MIN_USER_RATINGS,
        "neighborsPerMovie": NEIGHBORS_PER_MOVIE,
        "liveRatingCount": 0,
        "lastBuiltAt": None,
        "movies": catalog,
        "neighbors": neighbors,
    }
    out_path = OUT_DIR / "knn-recommend.json"
    out_path.write_text(json.dumps(payload), encoding="utf-8")
    ratings_path_out = OUT_DIR / "knn-ratings.json"
    ratings_path_out.write_text(
        json.dumps([[user_id, movie_id, rating] for user_id, movie_id, rating in ratings]),
        encoding="utf-8",
    )
    print(f"Wrote {out_path} ({out_path.stat().st_size / 1_048_576:.2f} MB)")
    print(f"Wrote {ratings_path_out} ({ratings_path_out.stat().st_size / 1_048_576:.2f} MB)")


if __name__ == "__main__":
    main()
