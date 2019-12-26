import React, {Component} from 'react';
import Modal from '../../component/Modal/Skeleton';
class addresses extends Component {
    state = {
        isActive: false,
        address: {}
    }
    toggleModal = () => {
        this.setState({
            isActive: !this.state.isActive
        })
    }
    selectAddress = (ev, item) => {
        if (ev.target.checked) {
            this.setState({
                address: item
            })
        } else {
            this.setState({
                address: {}
            })
        }
    }
    render () {
        const {
            words,
            disabled,
            addresses,
            transferAddress
        } = this.props;
        const { address } = this.state;
        return (
            <div className='inst-cart-addresses'>
                <button className="btn black small" onClick={this.toggleModal} disabled={disabled}>{words.gen_change}</button>
                <Modal
                    toggleModal={this.toggleModal}
                    isActive={this.state.isActive}
                    small
                >
                    <a onClick={this.toggleModal} className='close'>X</a>
                    {addresses.map((item) => {
                        return (
                            <div className='box address' key={item.id}>
                               <label className="control control--checkbox">
                                    <input
                                        type="checkbox"
                                        checked={item.id === address.id}
                                        onChange={(ev) => this.selectAddress(ev, item)}
                                    />
                                    <div className="control__indicator" />
                                </label>
                                <p>{item.address_line_1}, {item.city}, {item.zip}, {item.country}</p>
                            </div>
                        )
                    })}
                    <button
                        className='btn black small'
                        onClick={() => {
                            transferAddress(address);
                            this.toggleModal();
                        }}
                    >
                        {words.gen_transfer}
                    </button>
                </Modal>
            </div>
        );
    }
}

export default addresses;