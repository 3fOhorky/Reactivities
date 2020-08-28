import React, { useContext, useState } from "react";
import { Grid, Header, Button, Tab } from "semantic-ui-react";
import { RootStoreContext } from "../../app/stores/rootStore";
import ProfileEditForm from "./ProfileEditForm";
import { observer } from "mobx-react-lite";

const ProfileDescription = () => {
  const rootStore = useContext(RootStoreContext);
  const { profile, isCurrentUser } = rootStore.profileStore;

  const [editProfileMode, setEditProfileMode] = useState(true);

  return (
    <Tab.Pane>
      <Grid>
        <Grid.Column width={16}>
          <Header floated='left' icon="user" content={`About ${profile?.displayName}`} />
          {isCurrentUser && <Button basic floated="right" content={editProfileMode ? "Cancel" : "Edit Profile"} onClick={() => setEditProfileMode(!editProfileMode)}  />}
        </Grid.Column>
        <Grid.Column width={16}>
            { editProfileMode ? (
                <ProfileEditForm />
            ) : (
                <p>{profile?.bio}</p>
            ) }
          
        </Grid.Column>
      </Grid>
    </Tab.Pane>
  );
};

export default observer(ProfileDescription);
