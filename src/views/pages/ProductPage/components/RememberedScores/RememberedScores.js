import React, { Component } from "react";
import Request from "../../../../../utils/Request";
import auth from "../../../../../redux/account/authToken";

class RememberedScores extends Component {
    state = {
        name: "",
        items: [],
        createButtonDisabled: true
    };

    componentDidMount() {
        this.getLists();
    }

    getLists = () => {
        const headers = {
            Authorization: "Token " + auth.getActiveToken()
        };

        Request(
            "get",
            "create-list",
            headers,
            {},
            [],
            this.getListSuccess,
            this.getListFailure,
            undefined,
            undefined
        );
    };

    getListSuccess = response => {
        this.setState({
            items: response.data && response.data.results
        });
    };

    getListFailure = error => {
        console.log("error: ", error);
    };
    

    createList = name => {
        const headers = {
            Authorization: "Token " + auth.getActiveToken()
        };

        Request(
            "post",
            "create-list",
            headers,
            { name },
            [],
            this.createListSuccess,
            this.createListFailure,
            undefined,
            undefined
        );
    };

    createListSuccess = response => {
       this.getLists();
       this.setState({
        name: ""
    });
    };

    createListFailure = error => {
        if (error.response.status == 401) {
            this.props.toggleLoginRequiredModal();
        }
    };

    removeList = (id) => {
        const headers = {
            Authorization: "Token " + auth.getActiveToken()
        };

        Request(
            "delete",
            "delete-list",
            headers,
            {},
            [id],
            this.removeListSuccess,
            this.removeListFailure,
            undefined,
            undefined
        );
    };

    removeListSuccess = response => {
       this.getLists();
    };

    removeListFailure = error => {
       
    };

    handleInput = ev => {
        if (ev.target.value.length > 0) {
            this.setState({
                createButtonDisabled: false
            });
        } else if (ev.target.value.length == 0) {
            this.setState({
                createButtonDisabled: true
            });
        }
        this.setState({
            [ev.target.name]: ev.target.value
        });
    };

    handleSubmit = ev => {
        const { name } = this.state;
        ev.preventDefault();
        this.createList(name);
    };

    addProductTolist = (name) => {
        const { sid } = this.props;        
        const headers = {
            Authorization: "Token " + auth.getActiveToken()
        };

        Request(
            "post",
            "add-product-toList",
            headers,
            { name: name, score_sid: sid },
            [],
            this.addProductToListSuccess,
            this.addProductToListFailure,
            undefined,
            undefined
        );
    };

    addProductToListSuccess = (response) => {
       this.props.updateScoreList(response.data)
       this.props.toggleConfirmationModal()
    }

    addProductToListFailure = error => {
        console.log("error: ", error);
        if (error.response) {
            if (error.response.status == 401) {
                this.props.toggleLoginRequiredModal();
            }
        }
    };

    render() {
        const { words, invitation, toggleDetails, getListDetails } = this.props;
        const { name, items } = this.state;
        
        return (
            <React.Fragment>
                <h4>{words.popup_remlist_title || 'popup_remlist_title'}</h4>
                <ul>
                    {items.sort((a, b) => {
                        if(a.name > b.name) { return 1; }
                        if(a.name < b.name) { return -1; }
                    }).map(item => {
                        return (
                            <li key={item.memid}>
                                {item.name}
                                {invitation ?
                                <button
                                    className="btn black small"
                                    onClick={() => {
                                        toggleDetails()
                                        getListDetails(item)
                                    }
                                    }
                                >
                                   {words.popup_remlist_select || 'popup_remlist_select'}
                                </button>
                                :
                                <div>
                                    <a
                                        onClick={() => {
                                            this.addProductTolist(item.name) 
                                            getListDetails(item)
                                        }}
                                        style={{marginRight: '20px', cursor: 'pointer'}}
                                    >
                                        <img src='/media/images/add.png' width='30' height='30' />
                                    </a>
                                    <a
                                        style={{cursor: 'pointer'}}
                                        onClick={() => this.removeList(item.memid)}
                                    >
                                        <img src='/media/images/trash.png' width='25' height='33' />
                                    </a>
                                </div>
                                }
                            </li>
                        );
                    })}
                </ul>
                {!invitation && <form
                    className="remembered-scores-footer"
                    onSubmit={this.handleSubmit}
                >
                    <input
                        type="text"
                        onChange={this.handleInput}
                        value={name}
                        name="name"
                    />
                    <button
                        className="btn black small"
                        disabled={this.state.createButtonDisabled}
                    >
                        {words.popup_remlist_create || 'popup_remlist_create'}
                    </button>
                </form>}
            </React.Fragment>
        );
    }
}

export default RememberedScores;
