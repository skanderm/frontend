import {Component, Fragment} from 'react'
import url from 'url'
import _ from 'lodash'
import Head from 'next/head'
import Router from 'next/router'
import {Query} from 'react-apollo'
import {GET_FAVORITE_LISTINGS_IDS} from 'graphql/user/queries'
import {treatParams} from 'utils/filter-params.js'
import {mainListingImage} from 'utils/image_url'
import {getCurrentUserId, isAuthenticated} from 'lib/auth'
import {getListings} from 'services/listing-api'
import {getNeighborhoods} from 'services/neighborhood-api'
import InfiniteScroll from 'components/shared/InfiniteScroll'
import MapContainer from 'components/listings/index/Map'
import Listing from 'components/listings/index/Listing'
import ListingsNotFound from 'components/listings/index/NotFound'
import Filter from 'components/listings/index/Search'
import Container, {MapButton} from './styles'
const getDerivedState = ({initialState}) => {
  const currentPage = initialState.currentPage || 1
  return {
    ...initialState,
    currentPage,
    framedListings: [],
    mapOpened: false
  }
}

const splitParam = (param) => (param ? param.split('|') : [])

const getDerivedParams = ({query}) => ({
  price: {
    min: query.preco_minimo,
    max: query.preco_maximo
  },
  area: {
    min: query.area_minima,
    max: query.area_maxima
  },
  rooms: {
    min: query.quartos_minimo,
    max: query.quartos_maximo
  },
  neighborhoods: splitParam(query.bairros)
})

class ListingsIndex extends Component {
  constructor(props) {
    super(props)

    this.state = getDerivedState(props)
  }

  static async getInitialProps(context) {
    const [initialState, neighborhoods] = await Promise.all([
      this.getState(context.query),
      getNeighborhoods().then(({data}) => data.neighborhoods)
    ])

    return {
      initialState,
      neighborhoods,
      currentUser: {
        id: getCurrentUserId(context),
        authenticated: isAuthenticated(context)
      },
      query: context.query,
      renderFooter: false
    }
  }

  static async getState(query) {
    const page = query.page || 1

    const {data} = await getListings(null, {
      ...query,
      page,
      page_size: 400,
      excluded_listing_ids: query.excluded_listing_ids || []
    })

    return {
      ...data
    }
  }

  componentWillReceiveProps(props) {
    if (!_.isEqual(props.initialState, this.props.initialState)) {
      this.setState(getDerivedState(props))
    }
  }

  componentDidMount() {
    require('utils/polyfills/smooth-scroll').load()
  }

  onLoadNextPage = async () => {
    const {currentPage, totalPages} = this.state
    const excluded_listing_ids = this.state.listings.map(
      (actualListing) => actualListing.id
    )
    if (currentPage >= totalPages) return
    const {listings, ...state} = await this.constructor.getState({
      ...this.params,
      page: currentPage + 1,
      excluded_listing_ids
    })

    await this.setState({
      ...state,
      listings: [...this.state.listings, ...listings]
    })
  }

  onChangeFilter = (name, value) => {
    const params = treatParams({
      ...this.params,
      [name]: value
    })

    if (params) {
      Router.push(`/listings/index?${params}`, `/imoveis?${params}`)
    } else {
      Router.push('/listings/index', '/imoveis')
    }
  }

  onResetFilter = () => Router.push('/listings/index', '/imoveis')

  onUpdateRoute = (requestPath) => {
    const {query} = url.parse(requestPath, true)
    this.setState(
      getDerivedState({initialState: this.constructor.getState(query)})
    )
  }

  get params() {
    return getDerivedParams(this.props)
  }

  get seoImage() {
    const listing = this.state.listings[0]
    return listing ? mainListingImage(listing.images) : null
  }

  onSelectListing = (id, position) => {
    if (!position) {
      const element = document.getElementById(`listing-${id}`)
      element.scrollIntoView({
        behavior: 'smooth'
      })
    } else {
      this.setState({highlight: {...position}})
    }
  }

  onHoverListing = (listing) => {
    const {address: {lat, lng}} = listing
    this.setState({highlight: {lat, lng}})
  }

  onLeaveListing = () => {
    this.setState({highlight: {}})
  }

  onChangeMap = (framedListings) => {
    const {listings} = this.state
    const framed = listings.filter((listing) =>
      _.includes(framedListings, listing.id)
    )
    this.setState({framedListings: framed})
  }

  handleMap = () => {
    const {mapOpened} = this.state
    this.setState({mapOpened: !mapOpened})
  }

  render() {
    const {params} = this
    const {neighborhoods, currentUser, query, url, user} = this.props
    const {
      currentPage,
      totalPages,
      listings,
      remaining_count,
      highlight,
      framedListings,
      mapOpened
    } = this.state
    const seoImgSrc = this.seoImage
    return (
      <Fragment>
        <Head>
          <title>Apartamentos à venda no Rio de Janeiro | EmCasa</title>
          <meta
            name="description"
            content="Compre seu Imóvel na Zona Sul do Rio de Janeiro"
          />
          <meta
            property="og:description"
            content="Compre seu Imóvel na Zona Sul do Rio de Janeiro"
          />
          <meta property="og:image" content={seoImgSrc} />
          <meta name="twitter:card" content="summary_large_image" />
          <meta
            name="twitter:title"
            content="Apartamentos à venda no Rio de Janeiro | EmCasa"
          />
          <meta
            name="twitter:description"
            content="Compre seu Imóvel na Zona Sul do Rio de Janeiro"
          />
          <meta name="twitter:image" content={seoImgSrc} />
        </Head>
        <Filter
          params={params}
          neighborhoods={neighborhoods}
          onChange={this.onChangeFilter}
          onReset={this.onResetFilter}
        />

        <Container opened={mapOpened}>
          <MapButton opened={mapOpened} onClick={this.handleMap} />
          <div className="map">
            <MapContainer
              zoom={13}
              onSelect={this.onSelectListing}
              listings={listings}
              highlight={highlight}
              onChange={this.onChangeMap}
            />
          </div>

          <div className="entries-container">
            {listings.length == 0 ? (
              <ListingsNotFound
                filtered={!_.isEmpty(url.query)}
                resetAllParams={this.onResetFilter}
              />
            ) : (
              <Query query={GET_FAVORITE_LISTINGS_IDS}>
                {({data, loading, error}) => (
                  <InfiniteScroll
                    currentPage={currentPage}
                    totalPages={totalPages}
                    entries={
                      framedListings.length > 0 ? framedListings : listings
                    }
                    remaining_count={remaining_count}
                    onLoad={this.onLoadNextPage}
                    to={{pathname: '/imoveis', query}}
                    mapOpenedOnMobile={mapOpened}
                  >
                    {(listing) => (
                      <Listing
                        onMouseEnter={this.onHoverListing}
                        onMouseLeave={this.onLeaveListing}
                        highlight={highlight}
                        key={listing.id}
                        id={`listing-${listing.id}`}
                        listing={listing}
                        currentUser={user}
                        loading={loading}
                        mapOpenedOnMobile={mapOpened}
                        favorited={
                          error || !data.favoritedListings
                            ? []
                            : data.favoritedListings
                        }
                      />
                    )}
                  </InfiniteScroll>
                )}
              </Query>
            )}
          </div>
        </Container>
      </Fragment>
    )
  }
}

export default ListingsIndex
