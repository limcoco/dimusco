export default words => ({
  tableColumns: [
    words.gen_score_title || 'gen_score_title',
    words.gen_composer || 'gen_composer',
    words.gen_edition || 'gen_edition',
    words.gen_instrument || 'gen_instrument',
    words.gen_action || 'gen_action'
  ],
  tableColumnExtras: {
    [words.gen_score_title || 'gen_score_title']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'title'
      }
    },
    [words.gen_composer || 'gen_composer']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-3 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'composer'
      }
    },
    [words.gen_edition || 'gen_edition']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'edition'
      }
    },
    [words.gen_instrument || 'gen_instrument']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'instrument'
      }
    },
    [words.gen_action || 'gen_action']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-2 col-sm-3 col-xs-12 ',
      canSort: false
    }
  },
  tableColumnsPerformance: [
    words.gen_score_title || 'gen_score_title',
    words.gen_composer || 'gen_composer',
    words.gen_action || 'gen_action'
  ],
  tableColumnExtrasPerformance: {
    [words.gen_score_title || 'gen_score_title']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-4 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'title'
      }
    },
    [words.gen_composer || 'gen_composer']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-4 col-sm-3 col-xs-12 ',
      canSort: true,
      data: {
        sort: 'composer'
      }
    },
    [words.gen_action || 'gen_action']: {
      disabled: false,
      visible: true,
      clickable: true,
      className: 'col-content col-header col-md-4 col-sm-3 col-xs-12 ',
      canSort: false
    }
  }
});
