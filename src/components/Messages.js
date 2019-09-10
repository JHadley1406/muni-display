import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/lib/Col';
import Well from 'react-bootstrap/lib/Well';

class Messages extends React.Component{

    displayMessages = () =>{
        return(this.props.messages.map(function(message){
            return(<div key={message.id}><Well>{message.text}</Well></div>);
        }));
    };

    render(){
        return(<Col md={12} style={{background: 'lightgrey', border: '2px solid black', borderRadius: '5px'}}>
            {this.displayMessages()}
            </Col>);
    }

}

Messages.propType = {
  messages: PropTypes.array.isRequired
};

export default Messages;