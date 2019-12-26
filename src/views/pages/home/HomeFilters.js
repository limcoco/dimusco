import React from 'react';
import PropTypes from "prop-types";

import ComposerList from "./component/ComposerList.js";
import InstrumentList from "./component/InstrumentList.js";
import CategoryList from "./component/CategoryList.js";
import EditionList from "./component/EditionList.js";
import Duration from "./component/Duration.js";

const HomeFilters = ({toggleTab, activeTabIndex, handleComposerClick, lang, props, words, isCatalog}) => {
    return (
        <div className="search-controls">
            <ul id="tab" className=" row jtab-ul">
                <li onClick={()=>toggleTab(1)} className={isCatalog ? "col-xs-6 col-sm-4 col-md-2" : "col-xs-6 col-sm-3 col-md-2_4"}>
                <a className="box" id="composer">{words.gen_composer}</a>
                </li>
                <li onClick={()=>toggleTab(2)} className={isCatalog ? "col-xs-6 col-sm-4 col-md-2" : "col-xs-6 col-sm-3 col-md-2_4"}>
                <a className="box" id="edition">{words.gen_edition}</a>
                </li>
                <li onClick={()=>toggleTab(3)} className={isCatalog ? "col-xs-6 col-sm-4 col-md-2" : "col-xs-6 col-sm-3 col-md-2_4"}>
                <a className="box" id="instrument">{words.gen_instrument}</a>
                </li>
                <li onClick={()=>toggleTab(4)} className={isCatalog ? "col-xs-6 col-sm-4 col-md-2" : "col-xs-6 col-sm-3 col-md-2_4"}>
                <a className="box" id="category">{words.gen_category}</a>
                </li>
                <li onClick={()=>toggleTab(5)} className={isCatalog ? "col-xs-6 col-sm-4 col-md-2" : "col-xs-12 col-sm-12 col-md-2_4"}>
                <a className="box" id="duration">{words.gen_duration}</a>
                </li>
                {isCatalog &&
                <li onClick={()=>toggleTab(6)} className={isCatalog ? "col-xs-6 col-sm-4 col-md-2" : "col-xs-12 col-sm-12 col-md-2_4"}>
                <a className="box" id="duration">{words.gen_publisher}</a>
                </li>
                }
            </ul>

            {activeTabIndex > 0 && <button className="open-modal" type="button" onClick={() => toggleTab(0)} />}

            {/*content filters*/}
            {activeTabIndex > 0 &&
            <div className="jtab-content-list">
                <div id="tab_composer" className={activeTabIndex === 1 ? "jtab-content composer show" : "jtab-content composer"}>
                <ComposerList {...props} onClick={handleComposerClick} lang={lang} />
                </div>

                <div id="tab_edition" className={activeTabIndex === 2 ? "jtab-content composer show" : "jtab-content composer"}>
                <EditionList {...props} onClick={handleComposerClick} lang={lang} />
                </div>

                <div id="tab_instrument" className={activeTabIndex === 3 ? "jtab-content composer show" : "jtab-content composer"}>
                <InstrumentList {...props} onClick={handleComposerClick} lang={lang} />
                </div>

                <div id="tab_category" className={activeTabIndex === 4 ? "jtab-content composer show" : "jtab-content composer"}>
                <CategoryList {...props} onClick={handleComposerClick} lang={lang} />
                </div>

                <div id="tab_durtion" className={activeTabIndex === 5 ? "jtab-content duration show" : "jtab-content duration"}>
                <Duration {...props} onDurationClick={handleComposerClick} maxHours={5} steps={6} />
                </div>
                <div id="tab_durtion" className={activeTabIndex === 6 ? "jtab-content duration show" : "jtab-content duration"}>
                    Publishers
                </div>
            </div>
            }
            </div>
    )
}

HomeFilters.propTypes = {
    toggleTab: PropTypes.func.isRequired,
    activeTabIndex: PropTypes.number.isRequired,
    handleComposerClick: PropTypes.func.isRequired,
    lang: PropTypes.string.isRequired,
    props: PropTypes.object.isRequired,
    words: PropTypes.object.isRequired
}

export default HomeFilters;