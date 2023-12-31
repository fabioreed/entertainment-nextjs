import { Container, MediaContainer, MediaContent, Wrapper } from './styles'
import { SearchBar } from '@/components/SearchBar'
import { Header } from '@/components/Header'
import { pathToSearchTV } from '@/utils'
import { MediaCard } from '@/components/MediaCard'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Loading from '@/components/Loading'
import { PaginationTrendingBar } from '@/components/PaginationTrendingBar'
import { SearchResultItemProps } from '@/pages/search/[id]/index.page'
import { NextSeo } from 'next-seo'

export default function TrendingTv() {
  const router = useRouter()
  const { id } = router.query

  const [data, setData] = useState<SearchResultItemProps[] | undefined>()

  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetch(`/api/tv/trending/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data.results)
        setTotalPages(data.total_pages)
      })
      .catch((error) => {
        console.error('Error getting movie details:', error)
      })
  }, [id])

  return (
    <>
      <NextSeo title="Trending TV Series | MovieMentor" />
      {data ? (
        <Wrapper>
          <Header />
          <Container>
            <SearchBar
              searchPath={pathToSearchTV}
              placeholder="Search for TV series"
            />
            <MediaContainer>
              <MediaContent>
                {data.map((item: SearchResultItemProps) => {
                  return (
                    <MediaCard
                      key={item.id}
                      id={item.id}
                      name={item.name || item.title}
                      first_air_date={item.first_air_date || item.release_date}
                      backdrop_path={
                        item.backdrop_path ||
                        item.poster_path ||
                        item.profile_path
                      }
                      media_type="tv"
                    />
                  )
                })}
              </MediaContent>
            </MediaContainer>
            <PaginationTrendingBar
              actualPage={parseFloat(id as string)}
              searchPath="tv/trending/"
              totalPages={totalPages}
            />
          </Container>
        </Wrapper>
      ) : (
        <Loading />
      )}
    </>
  )
}
