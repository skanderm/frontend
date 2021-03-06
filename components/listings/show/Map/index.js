import React from 'react'
import FontAwesomeIcon from '@fortawesome/react-fontawesome'
import faHome from '@fortawesome/fontawesome-free-solid/faHome'

import Container from './styles'
import Map from 'components/shared/Map'

export default class ListingMap extends React.Component {
  render() {
    const {listing} = this.props
    const {lat, lng} = listing.address
    const text = <FontAwesomeIcon icon={faHome} />

    return (
      <Container>
        <Map center={{lat, lng}} markers={[{lat, lng, text}]} />
      </Container>
    )
  }
}
