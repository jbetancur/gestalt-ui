import React, { PureComponent } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { createRequestAction } from 'config/lib/actionFactory';

export default function withUserProfile(BaseComponent) {
  class UserProfile extends PureComponent {
    static displayName = 'UserProfile (HOC)';

    render() {
      return <BaseComponent {...this.props} />;
    }
  }

  const mapStateToProps = ({ userProfile }) => ({
    userProfile: userProfile.userProfile.userProfile.properties,
    userProfilePending: userProfile.userProfile.pending,
    favorites: userProfile.userProfile.userProfile.properties.resource_favorites,
  });

  const mapDispatchToProps = dispatch => ({
    userProfileActions: bindActionCreators({
      ...createRequestAction(['fetch'], 'DefaultUserProfile'),
      ...createRequestAction(['create', 'delete'], 'Favorite', {
        meta: {
          debounce: {
            time: 300,
          },
        },
      }),
    }, dispatch)
  });

  return connect(mapStateToProps, mapDispatchToProps)(UserProfile);
}
