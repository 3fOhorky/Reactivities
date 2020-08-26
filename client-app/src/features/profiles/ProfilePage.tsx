import React, { useContext, useEffect } from "react";
import ProfileHeader from "./ProfileHeader";
import { Grid } from "semantic-ui-react";
import { ProfileContent } from "./ProfileContent";
import { RootStoreContext } from "../../app/stores/rootStore";
import { LoadingComponent } from "../../app/layout/LoadingComponent";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react-lite";

interface ProfileParams {
    username: string;
}

const ProfilePage: React.FC<RouteComponentProps<ProfileParams>> = ({match}) => {
  const rootStore = useContext(RootStoreContext);
  const { loadProfile, profile, loadingProfile } = rootStore.profileStore;

    useEffect(() => {
        loadProfile(match.params.username)
    }, [loadProfile, match])

  if (loadingProfile) return <LoadingComponent content="Loading profile..." />;

  return (
    <Grid>
      <Grid.Column width={16}>
        <ProfileHeader profile={profile!} />
        <ProfileContent profile={profile!} />
      </Grid.Column>
    </Grid>
  );
};

export default observer(ProfilePage);