import { connect } from 'react-redux';
import Component from './component';
import {
  getContentList,
  preContentList,
  saveContentIndex,
  saveHistory,
} from '../actions';

const mapStateToProps = state => ({
  detail_chapter_id: state.comic.getIn(['detail', 'chapter_id']),
  content_index: state.comic.getIn(['detail', 'index']),
  pre_content: state.comic.get('pre_content'),
  go_to_flag: state.comic.get('go_to_flag'),
  mode: state.config.get('mode'),
});

const mapDispatchToProps = dispatch => ({
  getContent(params) {
    return dispatch(getContentList(params));
  },
  preContent(params) {
    return dispatch(preContentList(params));
  },
  saveIndex(params) {
    return dispatch(saveContentIndex(params));
  },
  postHistory(params) {
    return dispatch(saveHistory(params));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Component);
