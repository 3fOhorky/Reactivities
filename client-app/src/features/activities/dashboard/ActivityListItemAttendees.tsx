import React from "react";
import { List, Image, Popup } from "semantic-ui-react";
import { IAttendee } from "../../../app/models/activity";

interface IProps {
  attendees: IAttendee[];
}

const styles = {
  borderColor: 'orange',
  borderWidth: 2
}

export const ActivityListItemAttendees: React.FC<IProps> = ({ attendees }) => {
  return (
    <List horizontal>
      {attendees.map((attendee, i) => (
        <List.Item key={i}>
          <Popup
            header={attendee.displayName}
            trigger={
              <Image
                size="mini"
                circular
                src={attendee.image || "assets/user.png"}
                style={attendee.following ? styles : null}
              />
            }
          />
        </List.Item>
      ))}
    </List>
  );
};
