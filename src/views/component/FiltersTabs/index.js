import React, { Component } from 'react';
import ComposerList from '../../pages/home/component/ComposerList.js';
import InstrumentList from '../../pages/home/component/InstrumentList.js';
import CategoryList from '../../pages/home/component/CategoryList';
import EditionList from '../../pages/home/component/EditionList.js';
import Duration from '../../pages/home/component/Duration.js';
import classnames from 'classnames';

class FilterTabs extends Component {
    
    state = {
      activeTabIndex: 0,
    }

    toggleTab = (tab = null) => {
        if (!tab || this.state.activeTabIndex === tab) {
        this.setState({
            activeTabIndex: 0
        });
        } else {
        this.setState({
            activeTabIndex: tab
        });
        }
    }

    render () {
        const {words, lang, handleComposerClick} = this.props;
        
        return (
            <div className="row search-controls">
              <div className="col-md-12">
                <ul id="tab" className=" row jtab-ul">
                  <li
                    onClick={() => this.toggleTab(1)}
                    className={classnames('col-xs-6 col-sm-3 col-md-2_4', {
                      active: this.state.activeTabIndex === 1
                    })}
                  >
                    <a className="box" id="composer">
                      {words.gen_composer}
                      <p />
                    </a>
                  </li>
                  <li
                    onClick={() => this.toggleTab(2)}
                    className={classnames('col-xs-6 col-sm-3 col-md-2_4', {
                      active: this.state.activeTabIndex === 2
                    })}
                  >
                    <a className="box" id="edition">
                      {words.gen_edition}
                      <p />
                    </a>
                  </li>
                  <li
                    onClick={() => this.toggleTab(3)}
                    className={classnames('col-xs-6 col-sm-3 col-md-2_4', {
                      active: this.state.activeTabIndex === 3
                    })}
                  >
                    <a className="box" id="instrument">
                      {words.gen_instrument}
                      <p />
                    </a>
                  </li>
                  <li
                    onClick={() => this.toggleTab(4)}
                    className={classnames('col-xs-6 col-sm-3 col-md-2_4', {
                      active: this.state.activeTabIndex === 4
                    })}
                  >
                    <a className="box" id="category">
                      {words.gen_category}
                      <p />
                    </a>
                  </li>
                  <li
                    onClick={() => this.toggleTab(5)}
                    className={classnames('col-xs-12 col-sm-12 col-md-2_4', {
                      active: this.state.activeTabIndex === 5
                    })}
                  >
                    <a className="box" id="duration">
                      {words.gen_duration}
                      <p />
                    </a>
                  </li>
                </ul>

                {/*content filters*/}
                <div className="jtab-content-list">
                  <div
                    id="tab_composer"
                    className={
                      this.state.activeTabIndex === 1
                        ? 'jtab-content composer show'
                        : 'jtab-content composer'
                    }
                  >
                    <ComposerList
                      {...this.props}
                      onClick={handleComposerClick}
                      lang={lang}
                    />
                  </div>

                  <div
                    id="tab_edition"
                    className={
                      this.state.activeTabIndex === 2
                        ? 'jtab-content composer show'
                        : 'jtab-content composer'
                    }
                  >
                    <EditionList
                      {...this.props}
                      onClick={handleComposerClick}
                      lang={lang}
                    />
                  </div>

                  <div
                    id="tab_instrument"
                    className={
                      this.state.activeTabIndex === 3
                        ? 'jtab-content composer show'
                        : 'jtab-content composer'
                    }
                  >
                    <InstrumentList
                      {...this.props}
                      onClick={handleComposerClick}
                      lang={lang}
                    />
                  </div>

                  <div
                    id="tab_category"
                    className={
                      this.state.activeTabIndex === 4
                        ? 'jtab-content composer show'
                        : 'jtab-content composer'
                    }
                  >
                    <CategoryList
                      {...this.props}
                      onClick={handleComposerClick}
                      lang={lang}
                    />
                  </div>

                  <div
                    id="tab_durtion"
                    className={
                      this.state.activeTabIndex === 5
                        ? 'jtab-content duration show'
                        : 'jtab-content duration'
                    }
                  >
                    <Duration
                      {...this.props}
                      onDurationClick={handleComposerClick}
                      maxHours={5}
                      steps={6}
                    />
                  </div>
                </div>
              </div>
            </div>
        );
    }
}

export default FilterTabs;