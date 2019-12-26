import React from "react";

import Presenter from "../../../../group/presenter.js";
import Request from "../../../../group/utils/request.js";

export default class UpdateContactGroup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            name: props.name,
            new_name: props.name,
            disabled: false,
        }

        this.updateHandle = this.updateHandle.bind(this);
        this.onUpdateFailed = this.onUpdateFailed.bind(this);
        this.onUpdateSuccess = this.onUpdateSuccess.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);
    }
    updateHandle(e) {
        e.stopPropagation();
        this.onUpdate(this.props.id);
    }

    onUpdate(id) {
        const { name, new_name } = this.state;
        if (name === new_name) {
            this.props.closeUpdate({stopPropagation: () => {}})
        } else {
            Presenter.contactUpdate(Request.contactUpdate(id, this, this.onUpdateSuccess, this.onUpdateFailed))
        }

    }

    onUpdateSuccess(params, response) {
        this.props.changeName(this.state.new_name, true)

        // after change name close
        this.props.closeUpdate({stopPropagation: () => {}})
        const {words} = this.props;
        this.props.toggleMsgModal(words.popup_return_good)
    }

    onUpdateFailed(error) {
        const {words} = this.props;
        this.props.toggleMsgModal(words.popup_return_bad)
    }

    handleChange(e) {
        if (e.target.value.trim() !== "") {
            this.props.changeName(e.target.value, false)
            this.setState({
                new_name: e.target.value,
                disabled: false
            })
        } else {
            this.setState({ disabled: true })
        }

    }

    handleKeyPress(e) {
        if (e.key === "Enter" && e.shiftKey === false) {
            e.preventDefault();
            if (this.state.new_name.trim() !== "") {
                this.onUpdate(this.props.id)
            }
        }
    }

    componentDidMount() {
        if (document.getElementById('grouptxt').value == 'new group') {
            document.getElementById('grouptxt').select();
        }

        var addGroupBtn = document.getElementById('add_group');
        addGroupBtn.addEventListener('click', function (e) {
            if (document.getElementById('update')) {
                document.getElementById('update').click();
            }
        });

    }

    render() {
        const { name } = this.state;
        return (
            <div className="member-name">
                <input
                    autoFocus
                    type="text"
                    defaultValue={name}
                    onKeyPress={(e) => { this.handleKeyPress(e) }}
                    onChange={(e) => this.handleChange(e)}
                    onClick={(e) => e.stopPropagation()}
                    id="grouptxt"
                    onBlur={(e) => {
                        this.props.closeUpdate(e);
                        this.props.handleDraggable();
                    }}
                    onFocus={this.props.handleDraggable}
                />
            </div>
        );
    }
}
