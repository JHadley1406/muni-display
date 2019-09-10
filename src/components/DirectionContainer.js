import React from 'react';
import PropTypes from 'prop-types';
import ListView from "../common_components/ListView";
import Col from 'react-bootstrap/lib/Col';
import Panel from 'react-bootstrap/lib/Panel';
import Well from 'react-bootstrap/lib/Well';


class DirectionContainer extends React.Component{
    timeLayout = (prediction) => {
        return(<Well>{prediction.minutes}</Well>);
    };

    timeClickCallback = () => {
        console.log("Time Clicked");
    };

    render(){
        return(<Col md={6}>
            <Panel header={this.props.directionObject.title}>
                <ListView items={this.props.directionObject.prediction}
                          itemLayout={this.timeLayout}
                          itemSelectCallback={this.timeClickCallback}
                />
            </Panel>
            </Col>)
    }

}

DirectionContainer.propType = {
    directionObject: PropTypes.object.isRequired
};

export default DirectionContainer;