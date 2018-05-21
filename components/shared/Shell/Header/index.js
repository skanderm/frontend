import {Component, Fragment} from 'react'
import Link from 'next/link'
import EmCasaButton from 'components/shared/Common/Buttons/Rounded'
import UserMenu from './UserMenu'

import Container, {Button, Nav, UserHeader} from './styles'

export default class Header extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isMobileNavVisible: false
    }
  }

  toggleMobileNavVisibility = () => {
    const newState = !this.state.isMobileNavVisible
    this.setState({isMobileNavVisible: newState})
  }

  getUserHeader = (authenticated) => {
    const {user, notifications} = this.props
    const userMenu = [
      {
        title: 'Meu perfil',
        href: '/user/profile',
        as: '/meu-perfil'
      },
      {
        title: 'Meus imóveis',
        href: '/listings/user-listings',
        as: '/meus-imoveis'
      },
      {
        title: 'Imóveis favoritos',
        href: '/listings/fav',
        as: '/imoveis/favoritos'
      },
      {title: 'Sair', href: '/auth/logout'}
    ]
    return !authenticated ? (
      <UserHeader authenticated={authenticated}>
        <Link href="/auth/login" as="/login">
          <EmCasaButton light>Entrar</EmCasaButton>
        </Link>

        <Link href="/auth/signup" as="/signup">
          <EmCasaButton>Criar conta</EmCasaButton>
        </Link>
      </UserHeader>
    ) : (
      <UserMenu notifications={notifications} user={user} items={userMenu} />
    )
  }

  renderNav() {
    const {authenticated, isAdmin} = this.props
    const {isMobileNavVisible} = this.state
    return (
      <Fragment>
        <Button onClick={this.toggleMobileNavVisibility}>☰</Button>

        <Nav visible={isMobileNavVisible}>
          <Link href="/listings" as="/imoveis" prefetch>
            <a>Compre</a>
          </Link>

          <Link
            href="/listings/sell/know-more"
            as="/saiba-mais-para-vender"
            prefetch
          >
            <a>Venda</a>
          </Link>

          <Link href="/indique">
            <a>Indique e Ganhe</a>
          </Link>

          <Link href="http://blog.emcasa.com">
            <a>Blog</a>
          </Link>

          {isAdmin && (
            <Link href="/dashboard" as="/dashboard" prefetch>
              <a>Dashboard</a>
            </Link>
          )}

          {this.getUserHeader(authenticated, isAdmin)}
        </Nav>
      </Fragment>
    )
  }

  render() {
    return (
      <Container>
        <Link href="/" prefetch>
          <a className="logo">
            <img
              src="/static/emcasa-imobiliaria-rio-de-janeiro.png"
              alt="Emcasa Imobiliária no Rio de Janeiro"
            />
          </a>
        </Link>
        {this.renderNav()}
      </Container>
    )
  }
}
