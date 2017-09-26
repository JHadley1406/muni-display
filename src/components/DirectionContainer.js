import React from 'react';
import PropTypes from 'prop-types';
import ListView from "../common_components/ListView";
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Well from 'react-bootstrap/lib/Well';

class DirectionContainer extends React.Component{
    timeLayout = (timeVal) => {
        return(<Well>{timeVal}</Well>);
    };

    timeClickCallback = () => {
        console.log("Time Clicked");
    };

    render(){
        return(<Panel>
            <Col md={2}>
                {this.props.directionObject.direction}
            </Col>
            <Col md={10}>
                <ListView items={this.props.directionObject.predictions}
                          itemLayout={this.timeLayout}
                          itemSelectCallback={this.timeClickCallback}
                />
            </Col>
        </Panel>)
    }

}

DirectionContainer.propType = {
    directionObject: PropTypes.object.isRequired
};

export default DirectionContainer;