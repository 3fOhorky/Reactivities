import React, { useState, FormEvent, useContext } from "react";
import { Segment, Form, Button } from "semantic-ui-react";
import { IActivity } from "../../../app/models/activity";
import { v4 as uuid } from 'uuid';
import ActivityStore from '../../../app/stores/activityStore';
import { observer } from "mobx-react-lite";

interface IProps {
  activity: IActivity;
}

const ActivityForm: React.FC<IProps> = ({
  activity: initializeFormState,
}) => {
  const activityStore = useContext(ActivityStore);
  const { createActivity, editActivity, submitting, cancelFormOpen } = activityStore;
  const initializeForm = () => {
    if (initializeFormState) {
      return initializeFormState;
    } else {
      return {
        id: "",
        title: "",
        category: "",
        description: "",
        date: "",
        city: "",
        venue: "",
      };
    }
  };

  const [activity, setActivity] = useState<IActivity>(initializeForm);

  const handleSubmit = () => {
      if (activity.id.length === 0) {
        let newActivity = {
          ...activity,
          id: uuid()
        }

        createActivity(newActivity);

      } else {
        editActivity(activity);
      }
  }

  const handleInputChange = (e: FormEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget;
    setActivity({ ...activity, [name]: value });
  };

  return (
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
          onClick={cancelFormOpen}
          floated="right"
          content="Cancel"
        />
      </Form>
    </Segment>
  );
};

export default observer(ActivityForm);