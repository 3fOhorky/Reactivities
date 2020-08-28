import React, { useContext } from "react";
import { Form, Button } from "semantic-ui-react";
import { Form as FinalForm, Field } from "react-final-form";
import { TextInput } from "../../app/common/form/TextInput";
import { RootStoreContext } from "../../app/stores/rootStore";
import { FORM_ERROR } from "final-form";
import { observer } from "mobx-react-lite";
import { combineValidators, isRequired } from "revalidate";
import { TextAreaInput } from "../../app/common/form/TextAreaInput";

const validate = combineValidators({
  displayName: isRequired("Display Name"),
});

const ProfileEditForm = () => {
  const rootStore = useContext(RootStoreContext);
  const { updateProfile, profile } = rootStore.profileStore;

  return (
    <FinalForm
      validate={validate}
      onSubmit={(values: any) => {
        updateProfile(values).catch((error) => ({
          [FORM_ERROR]: error,
        }));
      }}
      render={({ handleSubmit, submitting, invalid, pristine }) => (
        <Form onSubmit={handleSubmit}>
          <Field
            name="displayName"
            component={TextInput}
            placeholder="Display name"
            initialValue={profile?.displayName}
          />
          <Field
            name="bio"
            component={TextAreaInput}
            placeholder="Biography"
            initialValue={profile?.bio}
            rows={3}
          />
          <Button
            positive
            content="Update profile"
            floated="right"
            loading={submitting}
            disabled={invalid || pristine}
          />
        </Form>
      )}
    ></FinalForm>
  );
};

export default observer(ProfileEditForm);
