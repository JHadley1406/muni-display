import React from 'react';
import PropTypes from 'prop-types';

class ListView extends React.Component {
    constructor(){
        super();
        this.listItems = this.listItems.bind(this);
        this.setClassAttrs = this.setClassAttrs.bind(this);
        this.setIdAttrs = this.setIdAttrs.bind(this);
    }

    listItems(){
        let self = this;
        return this.props.items.map(function(item){
            return(
                <Item
                    className={self.props.itemClassName}
                    id={self.props.itemIdName}
                    key={item.id}
                    item={item}
                    itemSelectCallback={() => self.props.itemSelectCallback(item)}
                    itemLayout={self.props.itemLayout}
                />);
        });
    }

    setClassAttrs(){
        let attrString = '';
        if(this.props.listClassName){
            attrString = this.props.listClassName;
        }

        return attrString;
    }

    setIdAttrs(){
        let attrString = '';
        if(this.props.listIdName) {
            attrString = this.props.listIdName;
        }

        return attrString;
    }

    render(){
        return (<div className={this.setClassAttrs} id={this.setIdAttrs}>
            {this.listItems()}
        </div>);
    }
}

ListView.propType = {
    itemClassName: PropTypes.string,
    itemIdName: PropTypes.string,
    listClassName: PropTypes.string,
    listIdName: PropTypes.string,
    items: PropTypes.array.isRequired,
    itemLayout: PropTypes.func.isRequired,
    itemSelectCallback: PropTypes.func,
};

class Item extends React.Component {
    constructor(){
        super();
        this.handleClick = this.handleClick.bind(this);
        this.setClassAttrs = this.setClassAttrs.bind(this);
        this.setIdAttrs = this.setIdAttrs.bind(this);
    }

    handleClick(item){
        this.props.itemSelectCallback(this.props.item);
    }

    setClassAttrs(){
        let attrString = '';
        if(this.props.itemClassName){
            attrString = this.props.itemClassName;
        }

        return attrString;
    }

    setIdAttrs(){
        let attrString = '';
        if(this.props.itemIdName){
            attrString = this.props.itemIdName;
        }

        return attrString;
    }

    render(){
        return(<div className={this.setClassAttrs()} id={this.setIdAttrs()} onClick={this.props.itemSelectCallback}>
            {this.props.itemLayout(this.props.item)}
        </div>)
    }
}

Item.propType = {
    itemSelectCallback: PropTypes.func,
    itemClassName: PropTypes.string,
    itemIdName: PropTypes.string,
    item: PropTypes.object.isRequired
};

export default ListView;