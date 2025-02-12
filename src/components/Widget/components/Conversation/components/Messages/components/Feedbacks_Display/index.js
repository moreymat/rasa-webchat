import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { PROP_TYPES } from 'constants';
import { emitUserMessage, toggleInputDisabled } from 'actions';
import ThemeContext from '../../../../../../ThemeContext';

import './styles.scss';

const default_max_feedbacks = 5

let feedback = ""
let deactivated = false

class Feedbacks_Display extends PureComponent {

  constructor(props) {

    super(props);

    deactivated = false
    feedback = ""

    const {
      message,
    } = this.props;

    if (message.get('feedbacks') !== undefined && message.get("nb_max_feedbacks") !== undefined) {
      message.get('feedbacks').size, message.get('feedbacks')._capacity = message.get("nb_max_feedbacks")
    }
    else {
      message.get('feedbacks').size, message.get('feedbacks')._capacity = default_max_feedbacks
    }

  }

  change_feedback(index) {

    if (feedback.includes(index)) {
      feedback = feedback.replace(" " + index, "").replace(index, "")
    }
    else {
      feedback += " " + index
    }

  }

  submit_feedback() {

    if (!deactivated) {
      const {
        chooseReply,
        id
      } = this.props;

      deactivated = true
      chooseReply(feedback)
    }

  }

  get_title(reply) {
    if (reply) {
      if (reply.get('title').length > 55) {
        return reply.get('title').substring(0, 65) + "..."
      }
      else {
        return reply.get('title')
      }
    }
  }

  renderFeedbacksDisplay(message, feedbacks) {

    console.log(feedbacks)

    if (!deactivated) {
      return (
        <div>
          {feedbacks.map((reply, index) => {
            if (reply) {
              return (
                <div
                  key={"feedb" + index}
                >
                  <input
                    type="checkbox"
                    className="checkbox_feedback"
                    name={"feed" + index}
                    value={index}
                    onChange={(e) => { e.stopPropagation(); this.change_feedback(index); }}
                  />
                  {this.get_title(reply)}
                </div>
              );
            }
          })}
          <input
            type="submit"
            className="submit_feedback_button"
            onClick={(e) => { e.stopPropagation(); this.submit_feedback(); }}
          />
        </div>
      );
    }
    else {
      return (
        <div>
          {feedbacks.map((reply, index) => {
            if (feedback.includes(index)) {
              return (
                <div
                  key={"feedb" + index}
                >
                  {"- " + reply.get('title')}
                </div>
              );
            }
          })}
        </div>
      );
    }
  }

  render() {

    const {
      message,
    } = this.props;

    if (message.get("feedbacks") !== undefined) {
      return this.renderFeedbacksDisplay(message, message.get('feedbacks'))
    }

  }

}

Feedbacks_Display.contextType = ThemeContext;

const mapStateToProps = state => ({
  getChosenReply: id => state.messages.get(id).get('chosenReply'),
  linkTarget: state.metadata.get('linkTarget')
});

const mapDispatchToProps = dispatch => ({
  toggleInputDisabled: () => dispatch(toggleInputDisabled()),
  chooseReply: (message) => {
    dispatch(emitUserMessage(message));
  }
});

Feedbacks_Display.propTypes = {
  getChosenReply: PropTypes.func,
  chooseReply: PropTypes.func,
  id: PropTypes.number,
  isLast: PropTypes.bool,
  message: PROP_TYPES.FEEDBACKS_DISPLAY,
  linkTarget: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(Feedbacks_Display);
