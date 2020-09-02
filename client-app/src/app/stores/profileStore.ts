import { RootStore } from "./rootStore";
import { IProfile, IPhoto, IUserActivity } from "../models/profile";
import { observable, action, runInAction, computed, reaction } from "mobx";
import agent from "../api/agent";
import { toast } from "react-toastify";

export default class ProfileStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    
    // reaction runs every time the variable changes (u ovom slučaju activeTab)
    reaction(
      () => this.activeTab,
      activeTab => {
        if (activeTab === 2) { 
          this.loadUserActivities('default');
        } else if (activeTab === 3 || activeTab === 4) {
          const predicate = activeTab === 3 ? 'followers' : 'following';
          this.loadFollowings(predicate);
        } else {
          this.followings = [];
        }
      }
    )
  }

  @observable profile: IProfile | null = null;
  @observable loadingProfile = true;
  @observable uploadingPhoto = false;
  @observable loading = false;
  @observable followings: IProfile[] = [];
  @observable activeTab: number = 0;
  @observable userActivities: IUserActivity[] = [];
  
  @computed get isCurrentUser() {
    if (this.rootStore.userStore.user && this.profile) {
      return this.rootStore.userStore.user.username === this.profile.username;
    } else {
      return false;
    }
  }

  @action setActiveTab = (activeIndex: number) => {
    this.activeTab = activeIndex;
  }

  @action loadProfile = async (username: string) => {
    this.loadingProfile = true;
    try {
      const profile = await agent.Profiles.get(username);
      runInAction(() => {
        this.profile = profile;
      });
    } catch (error) {
      throw error;
    } finally {
      runInAction(() => {
        this.loadingProfile = false;
      });
    }
  };

  // Partial<Type> constructs a type with all properties of Type set to optional
  @action updateProfile = async (profile: Partial<IProfile>) => {
    this.loading = true;
    try {
      await agent.Profiles.update(profile);
      runInAction(() => {
        if (this.profile) {
          this.rootStore.userStore.user!.displayName = profile.displayName!;
          this.profile = { ...this.profile, ...profile };
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action uploadPhoto = async (file: Blob) => {
    this.uploadingPhoto = true;
    try {
      const photo = await agent.Profiles.uploadPhoto(file);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos.push(photo);
          if (photo.isMain && this.rootStore.userStore.user) {
            this.rootStore.userStore.user.image = photo.url;
            this.profile.image = photo.url;
          }
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem uploading photo");
    } finally {
      runInAction(() => {
        this.uploadingPhoto = false;
      });
    }
  };

  @action setMainPhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.setMainPhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.rootStore.userStore.user!.image = photo.url;
          this.profile.image = photo.url;

          this.profile.photos.find((x) => x.isMain)!.isMain = false;
          this.profile.photos.find((x) => x.id === photo.id)!.isMain = true;
        }
      });
    } catch (error) {
      console.log(error);
      toast.error("Problem setting photo as main");
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action deletePhoto = async (photo: IPhoto) => {
    this.loading = true;
    try {
      await agent.Profiles.deletePhoto(photo.id);
      runInAction(() => {
        if (this.profile) {
          this.profile.photos = this.profile.photos.filter(
            (x) => x.id !== photo.id
          );
        }
      });
    } catch (error) {
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action follow = async (username: string) => {
    this.loading = true;
    try {
      await agent.Profiles.follow(username);
      runInAction(() => {
        this.rootStore.profileStore.profile!.following = true;
        this.rootStore.profileStore.profile!.followersCount++;
      });
    } catch (error) {
      toast.error("Problem following user");
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action unfollow = async (username: string) => {
    try {
      await agent.Profiles.unfollow(username);
      runInAction(() => {
        this.rootStore.profileStore.profile!.following = false;
        this.rootStore.profileStore.profile!.followersCount--;
      });
    } catch (error) {
      toast.error("Problem unfollowing user");
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadFollowings = async (predicate: string) => {
    this.loading = true;
    try {
      var followings = await agent.Profiles.listFollowings(
        this.profile!.username,
        predicate
      );
      runInAction(() => {
        this.followings = followings;
      });
    } catch (error) {
      toast.error("Problem loading followers");
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  @action loadUserActivities = async (username: string, predicate?: string) => {
    this.loading = true;
    try {
      const userActivities = await agent.Profiles.listUserActivities(username, predicate!)
      runInAction(() => {
        this.userActivities = userActivities;
      }) 
    } catch (error) {
      toast.error('Problem loading user activities');
      console.log(error);
    } finally {
      runInAction(() => {
        this.loading = false;
      })
    }
  }
}
