import React, { useState, FormEvent, useContext, useEffect } from "react";
import { Segment, Form, Button, Grid } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from "uuid";
import ActivityStore from "../../../app/stores/activityStore";
import { observer } from "mobx-react-lite";
import { RouteComponentProps } from "react-router-dom";

interface DetailParams {
  id: string;
}

const ActivityForm: React.FC<RouteComponentProps<DetailParams>> = ({
  match,
  history,
}) => {
  const activityStore = useContext(ActivityStore);
  const {
    createActivity,
    editActivity,
    submitting,
    activity: initialFormState,
    loadActivity,
    clearActivity,
  } = activityStore;

  const [activity, setActivity] = useState<IActivity>({
    id: "",
    title: "",
    category: "",
    description: "",
    date: "",
    city: "",
    venue: "",
  });

  useEffect(() => {
    if (match.params.id && activity.id.length === 0) {
      loadActivity(match.params.id).then(
        () => initialFormState && setActivity(initialFormState)
      );
    }
    return () => {
      clearActivity();
    };
  }, [
    loadActivity,
    clearActivity,
    match.params.id,
    initialFormState,
    activity.id.length,
  ]);

  const handleSubmit = () => {
    if (activity.id.length === 0) {
      let newActivity = {
        ...activity,
        id: uuid(),
      };

      createActivity(newActivity).then(() =>
        history.push(`/activities/${newActivity.id}`)
      );
    } else {
      editActivity(activity).then(() =>
        history.push(`/activities/${activity.id}`)
      );
    }
  };

  const handleInputChange = (
    e: FormEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
    <Grid>
      <Grid.Column width={10}>
        <Segment clearing>
          <Form onSubmit={handleSubmit}>
            <Form.Input
              placeholder="Title"
              name="title"
              value={activity.title}
              onChange={handleInputChange}
            ></Form.Input>
            <Form.TextArea
              rows={2}
              name="description"
              placeholder="Description"
              value={activity.description}
              onChange={handleInputChange}
            ></Form.TextArea>
            <Form.Input
              placeholder="Category"
              name="category"
              value={activity.category}
              onChange={handleInputChange}
            ></Form.Input>
            <Form.Input
              type="datetime-local"
              name="date"
              placeholder="Date"
              value={activity.date}
              onChange={handleInputChange}
            ></Form.Input>
            <Form.Input
              placeholder="City"
              name="city"
              value={activity.city}
              onChange={handleInputChange}
            ></Form.Input>
            <Form.Input
              placeholder="Venue"
              name="venue"
              value={activity.venue}
              onChange={handleInputChange}
            ></Form.Input>
            <Button
              type="submit"
              target={activity.id}
              loading={submitting}
              positive
              color="blue"
              floated="right"
              content="Save"
            />
            <Button
              type="button"
              onClick={() => history.push("/activities")}
              floated="right"
              content="Cancel"
            />
          </Form>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default observer(ActivityForm);
