import React, { Component, Fragment } from 'react'
import './style.css';
import Auth from '../../../redux/account/authToken';
import Request from "../../../utils/Request";
import InfoModal from '../../component/Modal/Info';
import AddAuthority from './AddAuthoritiesModal';
import  BigTable from './BigTable';
import  SmallTable from './SmallTable';
class Authorities extends Component {
    
    constructor(props) {
        super(props);
        this.state ={
            count : 0,
            data: [],
            smallTableData: [],
            isLoading: false,
            activeRow: {},
            rpp: 25,
            page :1,
            smallpage :1,
        }
    };

    componentDidMount() {
        this.state ={
            count : 0,
            data: [],
            smallTableData: [],
            isLoading: false,
            activeRow: {},
            rpp: 25,
            page :1,
            smallpage :1,
        },
        this.getAuthorities()
    }

    getAuthorities = (onSuccess, data = {}) => {
        this.startLoading()
        const headers = {
          Authorization: 'Token ' + Auth.getActiveToken()
        }
        const { filter_type, filter_language, ordering, rpp, page } = this.state;
        const payload = {
            filter_type,
            filter_language,
            ordering,
            rpp: data.rpp || rpp,
            page: data.page || page
        }
        Request(
          'get',
          'authorities',
          headers,
          payload,
          [],
          onSuccess ? onSuccess : this.onGetSuccess,
          this.onGetFailed
        );
    }

    onGetSuccess = (response) => {
        this.onBigGetSuccess(response)
        this.onSamllGetSuccess(response)
    }

    onBigGetSuccess = (response) => {
        this.stopLoad()
        this.setState({
            count: response.data.count,
            big_current_page: response.data.current_page,
            big_number_page: response.data.number_page,
            big_number_result: response.data.number_result,
            data: response.data.results || []
        })
    }

    onGetLargeTableDataSuccess = (response) => {
        this.stopLoad()
        this.setState({
            data: response.data.results || []
        }) 
    }

    onSamllGetSuccess = (response) => {
        this.stopLoad()
        this.setState({
            count: response.data.count,
            smallcurrent_page: response.data.current_page,
            number_page: response.data.number_page,
            number_result: response.data.number_result,
            data: response.data.results || [],
            smallTableData: response.data.results || []
        }) 
    }

    onGetFailed = (error) => {
        this.stopLoad()
        this.toggleMsgModal(false)
    }

    startLoading = () => {
        this.setState({
            isLoading: true
        })
    }

    stopLoad = () => {
        this.setState({
            isLoading: false
        })
    }

    // replaceAuthorities
    replaceAuthorities = () => {
        this.startLoading()
        const headers = {
            Authorization: 'Token ' + Auth.getActiveToken()
        }
        const {
            authority_to_replace,
            replace_with_authority
        } = this.state;
        Request(
            'post',
            'authority-replace',
            headers,
            {
                authority_to_replace,
                replace_with_authority
            },
            [],
            this.onReplaceAuthoritiesSuccess,
            this.onReplaceAuthoritiesFailed
          );
    }

    onReplaceAuthoritiesSuccess = (response) => {
        this.stopLoad()
        this.toggleMsgModal(true)
        this.getAuthorities()
    }

    onReplaceAuthoritiesFailed = () => {
        this.stopLoad()
        this.toggleMsgModal(false)
    }
    // replaceAuthorities
    
    // DeleteAuthority
    deleteAuthority = () => {
        this.startLoading()
        const headers = {
            Authorization: 'Token ' + Auth.getActiveToken()
        }
        const {
            authority_to_replace,
        } = this.state;
        Request(
            'delete',
            'delete-authority',
            headers,
            {},
            [authority_to_replace],
            this.onDeleteAuthoritySuccess,
            this.onDeleteAuthorityFailed
          );
    }

    onDeleteAuthoritySuccess = (response) => {
        this.stopLoad()
        this.getAuthorities()
        this.toggleMsgModal(true)
    }

    onDeleteAuthorityFailed = () => {
        this.stopLoad()
        this.toggleMsgModal(false)
    }
    // DeleteAuthority

    setActiveFrom = (authority_to_replace) => {
        this.setState({
            authority_to_replace
        })
    }

    setActiveTo = (replace_with_authority) => {
        this.setState({
            replace_with_authority
        })
    }

    toggleMsgModal = (isSuccess) => {
        this.setState((state) => ({
            ...state,
            isMsgActive: !state.isMsgActive,
            isSuccess
        }))
    }

    handleType = ({target: {value}}) => {
        this.setState({
            filter_type: value
        }, () => {
            this.getAuthorities()
        })
    }

    handleLangauge = ({target: {value}}) => {
        this.setState({
            filter_language: value
        }, () => {
            this.getAuthorities(this.onBigGetSuccess)
        })
    }

   

    onSmallTableHeaderItemClick = (e, data) => {
        if (data.data === null) return
    
        let fields = data.data.sort.split(',')
        for (let i = 0; i < fields.length; i++) {
          if (!data.ascending) {
            fields[i] = '-' + fields[i]
          }
        }
        this.setState({ ordering: fields.join(',') },
        () => {
            this.getAuthorities(this.onGetSmallTableDataSuccess)
        })
    }

    toggleAuthorityForm = (activeRow = {}) => {
        this.setState((state) => ({
            ...state,
            isActive: !state.isActive,
            activeRow
        }))
    }

    goToUrl = (url) => {
        if (url) {
            const link = document.createElement("a");
            link.target = '_blank';
            link.href = url;
            link.click();
        }
    }

    getState = (value) => {
        const { ActiveLanguageReducer: { words } } = this.props;
        let state = '';
        if (value === 0)
            state = words.state_preliminary || 'state_preliminary'
        if (value === 1)
            state = words.state_active || 'state_active'
        if (value === 2)
            state = words.state_flagged || 'state_flagged'
        if (value === 3)
            state = words.state_remove || 'state_removed'
        return state;
    } 

    pagination = page => {
        this.setState({
          rpp: this.state.rpp,
          page: page
        }, ()=>{
        this.getAuthorities(this.onBigGetSuccess)
        });  
    }

    smallpagination = smallpage => {
        this.setState({
          rpp: this.state.rpp,
          page: smallpage,
        },() => {
        this.getAuthorities(this.onSamllGetSuccess)
        });
    }

    handlePageClick = vaule => {
        console.log("data" + vaule.selected);
        let select = vaule.selected + 1
        this.pagination(select)
    }

    handleSmallPageClick = vaule =>{
        console.log("data" + vaule.selected);
        let selected = vaule.selected + 1
        this.smallpagination(selected)
    }

    changeRPP = event => {
        if (event.target.value < 1000 && event.target.value > 0) this.setState({ rpp: event.target.value })
        else if (event.target.value >= 1000) this.setState({ rpp: 999 })
        else if (event.target.value < 1) this.setState({ rpp: 1 })
    }

    callScoresWithRPP = () => {
        let resData = {
            page: 1,
            rpp: this.state.rpp,
        }

        this.getAuthorities(undefined, resData)
    }

    onTableHeaderItemClick = (value = {}) =>{
        console.log(value);
        this.setState({
            ordering:value.order
        }, ()=>{
        this.getAuthorities()
        });
    }
    
    render() {
        const { ActiveLanguageReducer: { words, lang } } = this.props;
        const {
            data,
            authority_to_replace,
            replace_with_authority,
            isMsgActive,
            isSuccess,
            isLoading,
            isActive,
            activeRow,
            smallTableData,
            smallcurrent_page,
            big_current_page,
            big_number_page,
            big_number_result,
            number_page,
            number_result,
            rpp
        } = this.state;

        

         
        return (
            <Fragment>
                {isActive &&
                    <AddAuthority
                        toggleModal={this.toggleAuthorityForm}
                        isActive={isActive}
                        words={words}
                        toggleMsgModal={this.toggleMsgModal}
                        data={activeRow}
                        getAuthorities={this.getAuthorities}
                        lang={lang}
                    />
                }
                <section className={`group-page authorities ${isLoading ? 'progress' : ''}`}>
                    {isMsgActive &&
                        <InfoModal
                            small
                            info={isSuccess ? words.popup_return_good : words.popup_return_bad}
                            toggleModal={this.toggleMsgModal}
                            isActive={isMsgActive}
                        />
                    }
                    <div className='container'>
                        <div className="row header-wrp">
                            <div className='col-md-4'>
                                <div className='row'>
                                    <div className='col-md-6'>
                                        <label>{words.gen_type || 'gen_type'}</label>
                                        <div className="select">
                                            <select onChange={this.handleType}>
                                                <option value=''>{words.gen_none}</option>
                                                <option value={1}>{words.gen_title || 'gen_title'}</option>
                                                <option value={2}>{words.gen_composer || 'gen_composer'}</option>
                                                <option value={3}>{words.gen_instrument || 'gen_instrumnet'}</option>
                                                <option value={4}>{words.gen_edition || 'gen_edition'}</option>
                                                <option value={5}>{words.gen_category || 'gen_category'}</option>
                                                <option value={6}>{words.gen_interests || 'gen_interests'}</option>
                                                <option value={7}>{words.gen_publisher || 'gen_publisher'}</option>
                                            </select>
                                            <div className="select__arrow"></div>
                                        </div>
                                    </div>
                                    <div className='col-md-6'>
                                        <label>{words.gen_language || 'gen_language'}</label>
                                        <div className="select">
                                            <select onChange={this.handleLangauge}>
                                                <option value=''>{words.gen_none}</option>
                                                <option value='en'>English</option>
                                                <option value='de'>German</option>
                                            </select>
                                            <div className="select__arrow"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4'>
                                <h1>{words.AU_management || 'AU_management'}</h1>
                            </div>
                            <div className='col-md-4' style={{textAlign: 'center'}}>
                                <button
                                    className='btn black'
                                    disabled={!authority_to_replace || !replace_with_authority }
                                    onClick={this.replaceAuthorities}
                                >
                                    {words.gen_replace}
                                </button>
                            </div>
                        </div>
                       
                        <div className='row'>
                            <BigTable
                                toggleAuthorityForm={this.toggleAuthorityForm}
                                deleteAuthority={this.deleteAuthority}
                                makeSortRequest={this.onTableHeaderItemClick}
                                words={words}
                                goToUrl={this.goToUrl}
                                clickpagination={this.handlePageClick}
                                setActiveFrom={this.setActiveFrom}
                                getState={this.getState}
                                data={data}
                                clickchangeRPP={this.changeRPP}
                                clickcallScoresWithRPP={this.callScoresWithRPP}
                                authority_to_replace={authority_to_replace}
                                current_page={big_current_page}
                                number_page={big_number_page}
                                number_result={big_number_result}
                                rpp={rpp}
                            />
                            <SmallTable
                                onSmallTableHeaderItemClick={this.onSmallTableHeaderItemClick}
                                setActiveTo={this.setActiveTo}
                                words={words}
                                data={data}
                                getState={this.getState}
                                smallTableData={smallTableData}
                                replace_with_authority={replace_with_authority}
                                clickpagination={this.handleSmallPageClick}
                                clickchangeRPP={this.changeRPP}
                                current_page={smallcurrent_page}
                                clickcallScoresWithRPP={this.callScoresWithRPP}
                                number_page={number_page}
                                number_result={number_result}
                                rpp={rpp}
                            />
                        </div>
                    </div>
                </section>
            </Fragment>
        )
    }
}

export default Authorities;