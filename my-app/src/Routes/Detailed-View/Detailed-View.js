import React from 'react';
import './Detailed-View.css';
import ListingHelper from '../../Helpers/Listing';
import { Link } from 'react-router-dom';
import Context from '../../Components/Context/Context';

export default class DetailedView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      listing: {},
      owner: {}
    };
  }

  static contextType = Context;
  static defaultProps = {
    match: { params: {} }
  };

  componentDidMount() {
    const { listingid } = this.props.match.params;
    ListingHelper.listingById(listingid).then(
      listingData =>
        this.setState({
          listing: listingData
        }) +
        ListingHelper.getListingOwnerData(listingData.owner).then(ownerData => {
          this.setState({ owner: ownerData });
        })
    );
  }

  deleteListing = () => {
    ListingHelper.delete(this.props.match.params.listingid).then(
      this.props.history.push('/Home')
    );
  };

  ownerOption = () => {
    if (this.context.currentUser.id === this.state.listing.owner) {
      return (
        <div className='ownerButtons'>
          <Link
            className='editListing'
            to={`/Edit-Listing/${this.state.listing.id}`}
          >
            Edit Listing
          </Link>
          <button className='deleteListing' onClick={this.deleteListing}>
            Delete Listing
          </button>
        </div>
      );
    }
  };

  render() {
    return (
      <div className='view'>
        <div className='section'>
          <h1 className='listing-title'>{this.state.listing.title}</h1>
          <div className='container'>
            <div
              className='image'
              style={{
                backgroundImage: `url(${this.state.listing.image})`
              }}
            />
          </div>
        </div>
        <div className='section'>
          <h1 className='listing-header'>LISTING DETAILS</h1>
          <div className='container'>
            <h2 className='item-title'>{this.state.listing.title}</h2>
            <span className='view-counter'>
              <i class='far fa-eye'></i> {this.state.listing.page_views}
            </span>
            <span className='item-price'>
              {' '}
              {`${this.state.owner.username} is wanting ${this.state.listing.price} for this item`}
            </span>
            <span className='item-condition'>
              Item is {this.state.listing.condition}
            </span>
            <span className='item-date_created'>
              Posted On:{' '}
              {
                new Date(this.state.listing.date_created)
                  .toLocaleString()
                  .split(',')[0]
              }
            </span>
            <p className='item-description'>{this.state.listing.description}</p>
            <div className='owner'>
              <span>Posted By: </span>
              <Link
                to={`/user/${this.state.owner.username}`}
                className='item-owner'
              >
                {this.state.owner.username}
              </Link>
            </div>
          </div>
          {this.ownerOption()}
        </div>
      </div>
    );
  }
}