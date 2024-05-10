import * as web3 from "@solana/web3.js"
import { Movie } from "./Movie"

const MOVIE_REVIEW_PROGRAM_ID = 'CenYq6bDRB7p73EjsPEpiYN7uveyPUTdXkDkgUduboaN'

export class MovieCoordinator {
    static accounts: web3.PublicKey[] = []

    static async prefetchAccounts(connection: web3.Connection){
        const accounts = await connection.getProgramAccounts(
            new web3.PublicKey(MOVIE_REVIEW_PROGRAM_ID),
            {
                dataSlice: {offset: 0, length: 0}
            }
        )
        this.accounts = accounts.map(account => account.pubkey)
    }

    static async fetchPage(connection: web3.Connection, page: number, perPage: number): Promise<Movie[]> {
        if(this.accounts.length === 0) {
            await this.prefetchAccounts(connection)
        }

        const paginatedPublicKeys = this.accounts.slice(
            (page - 1) * perPage,
            page * perPage,
        )
        if(paginatedPublicKeys.length === 0){
            return []
        }

        const accounts = await connection.getMultipleAccountsInfo(paginatedPublicKeys)

        const movies = accounts.reduce((accum: Movie[], account) => {
            const movie = Movie.deserialize(account?.data)
            if(!movie) {
                return accum
            }

            return [...accum, movie]
        }, [])

        return movies
    }
}