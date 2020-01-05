import React from 'react';
import '../../Styles/Profile.css';
import AuthHelper from '../../Helpers/Auth';
import ListingHelper from '../../Helpers/Listing';
import Listing from '../Listing/Listing';
import { Link } from 'react-router-dom';
import Context from '../Context/Context';

export default class DetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      profileData: {},
      firstName: '',
      myListings: []
    };
  }

  static contextType = Context;
  static defaultProps = {
    match: { params: {} }
  };

  truncate = text => {
    const words = text.split(' ');
    if (words.length > 2) {
      return words.slice(0, 2).join(' ') + ' ...';
    }
    return text;
  };

  componentDidMount() {
    AuthHelper.getPublicAccountData(this.props.match.params.username).then(
      data =>
        this.setState({
          profileData: data,
          firstName: data.name.split(' ')[0]
        }) +
        ListingHelper.getAllMyListings(data.id).then(listingData => {
          this.setState({ myListings: listingData });
        })
    );
  }

  editAccount = () => {
    console.log('not setup yet');
  };

  deleteAccount = () => {
    AuthHelper.deleteAccount(this.context.currentUser.username)
      .then(this.context.onLogout)
      .then(this.props.history.push('/Home'));
  };

  accountOption = () => {
    if (
      this.context.currentUser.username === this.props.match.params.username
    ) {
      return (
        <div className='accountButtons'>
          <button className='editAccount' onClick={this.editAccount}>
            Edit Account
          </button>
          <button className='deleteAccount' onClick={this.deleteAccount}>
            Delete Account
          </button>
        </div>
      );
    }
  };

  renderListing = () => {
    return this.state.myListings.map(listing => {
      return (
        <div className='item'>
          <Listing key={listing.id} {...listing} />
        </div>
      );
    });
  };

  renderNoListing = () => {
    return (
      <h3 className='noListing'>
        {this.state.firstName} has no listings currently
      </h3>
    );
  };

  render() {
    return (
      <div className='Profile'>
        <div className='section'>
          <h1 className='profile-name'>
            MEET {this.state.firstName.toUpperCase()}
          </h1>
          <div className='container'>
            <div
              className='avatar'
              style={{
                backgroundImage: `url(${this.state.profileData.avatar})`
              }}
            />
            <a
              className='profile-email'
              href={`mailto://${this.state.profileData.email}`}
            >
              {this.state.profileData.email}
            </a>
            <span className='profile-location'>
              Located in: {this.state.profileData.location}
            </span>
            <span className='profile-date_created'>
              Member Since: {this.state.profileData.date_created}
            </span>
          </div>
          {this.accountOption()}
        </div>
        <div className='section'>
          <h1>FOR SALE</h1>
          <div className='container listing'>
            {this.state.myListings.length > 0
              ? this.renderListing()
              : this.renderNoListing()}
          </div>
        </div>
      </div>
    );
  }
}