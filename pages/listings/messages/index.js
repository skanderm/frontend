import {Component, Fragment} from 'react'
import {Query} from 'react-apollo'
import {GET_LISTING_MESSAGES} from 'graphql/messenger/queries'
import {getJwt, redirectIfNotAuthenticated} from 'lib/auth'
import {getListing} from 'services/listing-api'
import Error from 'components/shared/Shell/Error'
import Link from 'next/link'
import Container from './styles'
import ConversationInfo from 'components/listings/messages/ConversationInfo'
import Conversation from 'components/listings/messages/Conversation'
import Head from 'next/head'
import {MESSAGE_SENT} from 'graphql/messenger/subscriptions'
import {GET_USER_INFO} from 'graphql/user/queries'

class ListingMessages extends Component {
  static async getInitialProps(context) {
    if (redirectIfNotAuthenticated(context)) {
      return {}
    }
    const adminMessengerId = process.env.ADMIN_MESSENGER_ID

    const id = context.query.id
    const userId = context.query.userId || adminMessengerId
    const jwt = getJwt(context)
    try {
      const listing = await getListing(id, jwt).then(({data}) => data.listing)

      return {
        listing,
        renderFooter: false,
        userId: parseInt(userId)
      }
    } catch (e) {
      return {
        statusCode: 404
      }
    }
  }

  showListingMessages = () => {
    const {listing, user, userId} = this.props
    const seoTitle = 'EmCasa | Messenger'

    return (
      <Query
        query={GET_USER_INFO}
        variables={{
          id: user.id
        }}
      >
        {({data: {userProfile}, loading}) => (
          <Fragment>
            <Head>
              <title>{seoTitle}</title>
              <meta name="twitter:title" content={seoTitle} />
            </Head>
            <Query
              query={GET_LISTING_MESSAGES}
              variables={{listingId: listing.id, senderId: userId}}
              fetchPolicy="network-only"
            >
              {({subscribeToMore, ...result}) => {
                return (
                  <Container>
                    {!loading && (
                      <Fragment>
                        <ConversationInfo
                          listing={listing}
                          currentUser={userProfile}
                          receiver={
                            result.data.listingUserMessages
                              ? result.data.listingUserMessages.user
                              : undefined
                          }
                        />

                        <Conversation
                          listing={listing}
                          currentUser={userProfile}
                          receiver={userId}
                          messages={
                            result.data.listingUserMessages
                              ? result.data.listingUserMessages.messages
                              : []
                          }
                          subscribeToNewMessages={() =>
                            subscribeToMore({
                              document: MESSAGE_SENT,
                              updateQuery: (prev, {subscriptionData}) => {
                                if (!subscriptionData.data) return prev
                                const newMessage =
                                  subscriptionData.data.messageSent

                                return {
                                  ...prev,
                                  listingUserMessages: {
                                    ...prev.listingUserMessages,
                                    messages: [
                                      ...prev.listingUserMessages.messages,
                                      newMessage
                                    ]
                                  }
                                }
                              }
                            })
                          }
                        />
                      </Fragment>
                    )}
                  </Container>
                )
              }}
            </Query>
          </Fragment>
        )}
      </Query>
    )
  }

  render() {
    const {statusCode} = this.props

    return statusCode ? (
      <Error>
        <h1>Imóvel não encontrado</h1>
        <h2>{statusCode}</h2>
        <p>
          Visite nossa <Link href="/">página inicial</Link> ou entre em&nbsp;
          <Link href="mailto:contato@emcasa.com">contato</Link> com a gente
        </p>
      </Error>
    ) : (
      this.showListingMessages()
    )
  }
}

export default ListingMessages
