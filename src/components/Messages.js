import React from 'react';
import PropTypes from 'prop-types';

class Messages extends React.Component{

    displayMessages = () =>{
        this.props.messages.map(function(message){
            return(<div>{message}</div>);
        })
    };

    render(){
        return(<div></div>);
    }

}

Messages.propType = {
  messages: PropTypes.array.isRequired
};

export default Messages;