import React from 'react';
import classnames from 'classnames';

export default class Preview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      height: 0,
      width: 0,
      page: 0,
      sidePage: 0,
      brokenPage: ''
    };

    this.minusHeight = 24;

    this.next = this.next.bind(this);
    this.prev = this.prev.bind(this);
    this.handleNavigationKey = this.handleNavigationKey.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.onClose = this.onClose.bind(this);
    this.getBrokenImage = this.getBrokenImage.bind(this);
  }

  updateWindowDimensions() {
    this.setState({
      width: window.innerWidth,
      height: window.innerHeight
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.previewMode) {
      window.addEventListener('keydown', this.handleNavigationKey);
    }
  }

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
    window.removeEventListener('keydown', this.handleNavigationKey);
  }

  resetPage() {
    this.setState({ page: 0, brokenPage: '' });
  }

  onClose() {
    this.props.togglePreviewMode();
    this.resetPage();
    setTimeout(() => {
      this.setState(
        Object.keys(this.state).reduce((a, c) => {
          if (c !== 'height' && c !== 'width') a[c] = undefined;
          else a[c] = this.state[c];
          return a;
        }, {}),
        () => {
          this.setState({
            page: 0,
            sidePage: 0,
            brokenPage: ''
          });
        }
      );
    }, 1000);
  }

  handleNavigationKey(e) {
    const { previewMode, togglePreviewMode } = this.props;

    if (e.key === 'ArrowRight') {
      this.next();
    } else if (e.key === 'ArrowLeft') {
      this.prev();
    } else if (e.key === 'Escape') {
      if (previewMode) {
        togglePreviewMode();
        this.resetPage();
      }
    }
  }

  next() {
    if (this.state.page !== this.state.brokenPage) {
      const { nop } = this.props;
      const { page } = this.state;

      let last_page = nop - 1;

      if (page <= nop) {
        if (this.state.sidePage >= 2 && this.state.page < last_page) {
          this.setState({
            page: this.state.page + 2,
            sidePage: this.state.page + 3
          });
        } else {
          if (last_page < page) {
            // ########### Max page
            this.setState({
              page: this.state.page,
              sidePage: this.state.page
            });
          } else {
            this.setState({
              page: this.state.page + 1,
              sidePage: this.state.page + 2
            });
          }
        }
      }
    }
  }

  prev() {
    const { page, sidePage } = this.state;

    if (page >= 1) {
      if (sidePage <= 2) {
        this.setState({
          page: this.state.page - 1,
          sidePage: this.state.page - 1
        });
      } else {
        this.setState({
          page: this.state.page - 2,
          sidePage: this.state.page - 1
        });
      }
    }
  }

  getBrokenImage(img, page) {
    const { previewMode } = this.props;
    if (previewMode) {
      this.setState({
        [img]: true,
        brokenPage: page
      });
    }
  }

  renderScoreView() {
    const { height, page, sidePage } = this.state;
    const { nop, data, token, keyQuery } = this.props;

    let last_page = nop - 1;
    let strQuery = keyQuery == undefined ? "" : `&key=${keyQuery}`

    for (let i in data) {
      if (page <= 0) {
        return (
          <div>
            {this.state[data[0]] ? (
              <div className="message-box">
                {this.props.words.prod_preview_limit || 'prod_preview_limit'}
              </div>
            ) : (
                <img
                  src={`${data[0]}?token=${token}${strQuery}`}
                  alt={'score page ' + data[0]}
                  height={height - this.minusHeight}
                  onError={() => this.getBrokenImage(data[0], page)}
                />
              )}
            <div className="next-score">
              {this.state[data[page + 1]] ? (
                <div className="message-box">
                  {this.props.words.prod_preview_limit || 'prod_preview_limit'}
                </div>
              ) : (
                  <img
                    src={data[page + 1] && `${data[page + 1]}?token=${token}${strQuery}`}
                    alt={'score page ' + page + 1}
                    height={height - this.minusHeight}
                    className={'separator-score'}
                    onError={() => this.getBrokenImage(data[page + 1], page)}
                  />
                )}
              {this.state[data[sidePage + 2]] ? (
                <div className="message-box">
                  {this.props.words.prod_preview_limit || 'prod_preview_limit'}
                </div>
              ) : (
                  <img
                    src={
                      data[sidePage + 2] && `${data[sidePage + 2]}?token=${token}${strQuery}`
                    }
                    alt={'score page ' + sidePage + 2}
                    height={height - this.minusHeight}
                    onError={() => this.getBrokenImage(data[sidePage + 2], page)}
                  />
                )}
            </div>
          </div>
        );
      } else if (page >= nop || sidePage >= nop) {
        return this.state[data[last_page]] ? (
          <div className="message-box">
            {this.props.words.prod_preview_limit || 'prod_preview_limit'}
          </div>
        ) : (
            <img
              src={`${data[last_page]}?token=${token}${strQuery}`}
              alt={'score page ' + last_page}
              height={height - this.minusHeight}
              onError={() => this.getBrokenImage(data[last_page], page)}
            />
          );
      } else {
        return (
          <React.Fragment>
            <div className="active">
              {/*<div className="animated-background masker-book-preview"></div>*/}
              {this.state[data[page]] && this.state[data[sidePage]] ? (
                <div className="message-box">
                  {this.props.words.prod_preview_limit || 'prod_preview_limit'}
                </div>
              ) : !this.state[data[page]] && this.state[data[sidePage]] ? (
                <React.Fragment>
                  <img
                    src={`${data[page]}?token=${token}${strQuery}`}
                    alt={'score page ' + page}
                    height={height - this.minusHeight}
                    className={'separator-score'}
                    onError={() => this.getBrokenImage(data[page], page)}
                  />
                  <div className="message-box">
                    {this.props.words.prod_preview_limit || 'prod_preview_limit'}
                  </div>
                </React.Fragment>
              ) : !this.state[data[sidePage]] && this.state[data[page]] ? (
                <React.Fragment>
                  <div className="message-box">
                    {this.props.words.prod_preview_limit || 'prod_preview_limit'}
                  </div>
                  <img
                    src={`${data[sidePage]}?token=${token}${strQuery}`}
                    alt={'score page ' + sidePage}
                    height={height - this.minusHeight}
                    onError={() => this.getBrokenImage(data[sidePage], page)}
                  />
                </React.Fragment>
              ) : (
                      <React.Fragment>
                        <img
                          src={`${data[page]}?token=${token}${strQuery}`}
                          alt={'score page ' + page}
                          height={height - this.minusHeight}
                          className={'separator-score'}
                          onError={() => this.getBrokenImage(data[page], page)}
                        />
                        <img
                          src={`${data[sidePage]}?token=${token}${strQuery}`}
                          alt={'score page ' + sidePage}
                          height={height - this.minusHeight}
                          onError={() => this.getBrokenImage(data[sidePage], page)}
                        />
                      </React.Fragment>
                    )}
            </div>
          </React.Fragment>
        );
      }
    }
  }

  renderPreview() {
    const { data, words, nop } = this.props;
    const { page } = this.state;

    if (typeof data === 'undefined') {
      return (
        <div className="col-md-12 col-sm-12 col-xs-12 score-preview">
          <h3 className="no-preview">{words.preview_loading || 'preview_loading'}...</h3>
        </div>
      );
    } else if (Object.keys(data).length === 0) {
      return (
        <div className="col-md-12 col-sm-12 col-xs-12 score-preview">
          <h3 className="no-preview">{words.preview_not_found || 'preview_not_found'}</h3>
        </div>
      );
    } else {
      return (
        <section className="full-width">
          <div
            className={classnames('flip-button-left', { hide: page < 1 })}
            onClick={this.prev}
          >
            <img src="/media/images/icon/prev_previous.png" alt="Next" />
          </div>

          <div className="col-md-12 col-sm-12 col-xs-12 score-preview">
            {this.renderScoreView()}
          </div>

          <div
            className={classnames('flip-button-right', { hide: page >= nop })}
            onClick={this.next}
            style={
              this.state.page === this.state.brokenPage
                ? {
                  pointerEvents: 'none',
                  cursor: 'default',
                  textDecoration: 'none',
                  color: 'black'
                }
                : {}
            }
          >
            <img
              src="/media/images/icon/prev_next.png"
              alt="Previous"
              disabled
            />
          </div>
        </section>
      );
    }
  }

  render() {
    const { previewMode, togglePreviewMode, nop } = this.props;
    const { page } = this.state;
    
    return (
      <div
        tabIndex="-1"
        className={classnames('preview-panel', {
          'preview-mode-off': !previewMode
        })}
      >
        <div className="row">
          <div className="close-preview" onClick={this.onClose}>
            <i className="material-icons">close</i>
          </div>
          {this.renderPreview()}
        </div>
      </div>
    );
  }
}
