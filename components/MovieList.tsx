import { Card } from './Card'
import { FC, useEffect, useState } from 'react'
import { Movie } from '../models/Movie'
import * as web3 from '@solana/web3.js'
import { MovieCoordinator } from '../models/MovieCoordinator'


export const MovieList: FC = () => {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'))
    const [movies, setMovies] = useState<Movie[]>([])
    const [page, setPage] = useState(1)

    useEffect(() => {
        MovieCoordinator.fetchPage(
            connection,
            page,
            10
        ).then(setMovies)
    }, [page])
    
    return (
        <div>
            {
                movies.map((movie, i) => <Card key={i} movie={movie} /> )
            }
        </div>
    )
}