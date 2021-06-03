import React from "react";
import Button from '@material-ui/core/Button';
import EventNote from '@material-ui/icons/EventNote';
import history from 'history/browser';

// export interface CellProps {
//     value?: number | string;
//     data: { history: History<unknown> } & any;
// }

// export interface CellButtonProps extends CellProps {
//     getUrl: () => string;
// }

export const CellButton = (props) => {
    let msg = "Loading"
    if (props.value || props.value === 0) {
        msg = props.value.toString()
    }
    props.data.history = history
    return (
        <div style={{ width: "100%", justifyContent: 'left', textAlign: "left", marginTop: -3 }}>
            <Button color="primary" size="small" style={{ justifyContent: 'left', textAlign: "left" }}
                onClick={() => { props.data.history.push(props.getUrl()) }}>
                <EventNote />
                {msg}
            </Button>
        </div>
    )
}