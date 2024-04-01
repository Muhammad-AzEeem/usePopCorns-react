import { useEffect, useRef, useState } from 'react'
import StarRating from './StarRating'
import { Loader } from './Loader'

const KEY = 'ca1785b2'

export function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watched,
}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')
  const countRef = useRef(0)

  useEffect(
    function () {
      if (userRating) countRef.current++
    },
    [userRating]
  )

  const isWatched = watched.map((movie) => movie.imbdID).includes(selectedId)
  const watchedUserRating = watched.find(
    (movie) => movie.imbdID === selectedId
  )?.userRating

  const {
    Title: title,
    Year: year,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie

  // we should not use the useState in if conditions...
  /* eslint-disable */
  // if (imdbRating > 8) [isTop, setIsTop] = useState(true)

  // === lec 162 code fron line 39 to 45..
  /*
  const [isTop, setIsTop] = useState(imdbRating > 8)
  useEffect(function () {
    setIsTop(imdbRating > 8)
  }, [])
  const isTop = imdbRating > 8
  const [avgRating, setAvgRating] = useState(0)
  */

  function handleAdd() {
    const newWatchMovie = {
      imdbID: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countRatingDecision: countRef.current,
    }

    onAddWatched(newWatchMovie)
    onCloseMovie()

    // == Lec 162 code..
    // setAvgRating(Number(imdbRating))
    // setAvgRating((avgRating) => (avgRating + userRating) / 2)
  }

  useEffect(
    function () {
      async function getMoviesDetails() {
        setIsLoading(true)
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`
        )
        const data = await res.json()
        setMovie(data)
        setIsLoading(false)
      }

      getMoviesDetails()
    },
    [selectedId]
  )

  useEffect(
    function () {
      if (!title) return
      document.title = `Movie | ${title}`

      return function () {
        document.title = 'usePopcorn'
      }
    },
    [title]
  )

  useEffect(
    function () {
      function callBack(e) {
        if (e.code === 'Escape') {
          onCloseMovie()
        }
      }

      document.addEventListener('keydown', callBack)

      return function () {
        document.removeEventListener('keydown', callBack)
      }
    },
    [onCloseMovie]
  )

  return (
    <div className='details'>
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className='btn-back' onClick={onCloseMovie}>
              &larr;
            </button>

            <img src={poster} alt={`Poster of ${movie} movie `} />
            <div className='details-overview'>
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          <section>
            <div className='rating'>
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && (
                    <button className='btn-add' onClick={handleAdd}>
                      Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </>
      )}
    </div>
  )
}
