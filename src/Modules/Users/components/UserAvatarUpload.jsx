import React, { Fragment, useCallback, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useDropzone } from 'react-dropzone';
import { FlatButton } from 'components/Buttons';
import { withUserProfile } from 'Modules/UserProfile';

const Base = styled.div`
  width: 128px;
  height: 128px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  user-select: none;
`;

const DragSection = styled(Base)`
  position: relative;
  border-style: ${props => (props.hasImage ? 'none' : 'dashed')};
  border-width: 4px;
  border-color: ${props => props.theme.colors.divider};
  transition: border-color 150ms linear;

  &:hover {
    border-style: solid;
    border-width: 4px;
    border-color: ${props => props.theme.colors.active};
    cursor: pointer;

    #user-avatar {
      z-index: ${props => (props.hasImage ? 2 : 0)};
      color: ${props => (props.hasImage ? 'white' : props.theme.colors.active)};
    }
  }
`;

const UploadText = styled.div`
  position: absolute;
  padding: 16px;
  border: none;
  color: ${props => props.theme.colors.disabled};
  font-weight: 700;
  font-size: 12px;
  transition: color 150ms linear;
`;

const Img = styled.img`
  height: 120px;
  width: 120px;
  border-radius: 50%;
  z-index: 1;

  &:hover {
    z-index: 0;
  }
`;

const UserAvatarUpload = ({ user, userProfile, userProfilePending, userProfileActions }) => {
  const [avatar, setAvatar] = useState(userProfile.properties.avatar);
  const [updated, setUpdated] = useState(false);
  const saveLabel = updated ? 'Saved' : 'Save';

  useEffect(() => {
    setAvatar(userProfile.properties.avatar);
    setUpdated(!!userProfile.properties.avatar);
  }, [userProfilePending, userProfile.properties.avatar]);


  const onDrop = useCallback((acceptedFiles) => {
    const reader = new FileReader();

    reader.onload = () => {
      const width = 128;
      const height = 128;
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const elem = document.createElement('canvas');
        elem.width = width;
        elem.height = height;
        const ctx = elem.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const image = ctx.canvas.toDataURL('image/jpeg', 0.7);
        setAvatar(image);
        setUpdated(false);
      };
    };

    acceptedFiles.forEach(file => reader.readAsDataURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const saveAvatar = () => {
    const payload = [{ op: 'add', path: '/properties/avatar', value: avatar }];
    setUpdated(true);

    userProfileActions.updateUserProfile({
      fqon: userProfile.org.properties.fqon,
      id: userProfile.id,
      payload,
    });
  };

  const deleteAvatar = () => {
    const payload = [{ op: 'remove', path: '/properties/avatar' }];
    const onSuccess = () => {
      setAvatar(null);
      setUpdated(false);
    };

    if (userProfile.properties.avatar) {
      userProfileActions.updateUserProfile({
        fqon: userProfile.org.properties.fqon,
        id: userProfile.id,
        payload,
        onSuccess,
      });
    } else {
      setAvatar(null);
    }
  };

  // only display if the users own profile
  if (userProfile.properties.parent.id !== user.id) {
    return null;
  }

  return (
    <Fragment>
      <DragSection {...getRootProps()} hasImage={!!avatar}>
        <input
          {...getInputProps()}
          accept="image/*"
          multiple={false}
        />
        <UploadText id="user-avatar" hasImage={!!avatar}>Drag or click to update your photo</UploadText>
        {avatar && <Img src={avatar} />}
      </DragSection>
      <FlatButton label={saveLabel} color="primary" onClick={saveAvatar} disabled={!avatar || userProfilePending || updated} />
      <FlatButton label="Delete" onClick={deleteAvatar} disabled={!avatar || userProfilePending} />
    </Fragment>
  );
};

UserAvatarUpload.propTypes = {
  user: PropTypes.object.isRequired,
  userProfile: PropTypes.object.isRequired,
  userProfilePending: PropTypes.bool.isRequired,
  userProfileActions: PropTypes.object.isRequired,
};

export default withUserProfile(UserAvatarUpload);
