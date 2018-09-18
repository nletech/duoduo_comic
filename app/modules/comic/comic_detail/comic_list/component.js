import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SectionList, Dimensions } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { ComicListItem, ComicListCategory, Progress } from '@/comic/comic_detail';
import styled from 'styled-components';
import { wrapWithLoading } from 'utils';

const { height } = Dimensions.get('window');
const initNumber = Math.ceil(height / 50);

const ItemSeparatorComponent = styled.View`
  border-bottom-color: #c0c0c0;
  border-bottom-width: 1px;
`;

function _getItemLayout(arr, index) {
  let len = 0;
  let offset = 50;
  arr.forEach(({ data }, i) => { // 计算分类标题高度
    len += data.length;
    if (i < len) return;
    offset += 50;
  });
  return { length: 51, offset: 51 * (index - 1) + offset, index };
}
function _keyExtractor(item) {
  return `${item.id}`;
}

@wrapWithLoading
class ComicListComponent extends Component {
  static propTypes = {
    list: PropTypes.array.isRequired,
    chapter_id: PropTypes.number,
    comic_id: PropTypes.number,
    getList: PropTypes.func.isRequired,
    hideLoading: PropTypes.func.isRequired,
    isReplace: PropTypes.bool,
    dark: PropTypes.bool,
    loading: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    chapter_id: 0,
    comic_id: 0,
    isReplace: false,
    dark: false,
  }

  componentDidMount() {
    this.onFetch();
  }

  shouldComponentUpdate(nextProps) {
    const {
      list, chapter_id, loading, dark,
    } = this.props;
    return nextProps.list !== list
      || nextProps.chapter_id !== chapter_id
      || nextProps.dark !== dark
      || nextProps.loading !== loading;
  }

  async onFetch() {
    const { id } = this.props;
    const {
      getList, hideLoading, comic_id, chapter_id,
    } = this.props;
    let res = {};
    try {
      res = await getList(id || comic_id);
    } catch (e) {
      hideLoading();
      return;
    }
    let sectionIndex = 0;
    let itemIndex = 0;
    res.value && res.value.data.forEach((outer, o) => {
      outer.data.forEach((inner, i) => {
        if (inner.id === chapter_id) {
          sectionIndex = o;
          itemIndex = i;
        }
      });
    });
    setTimeout(() => this.scrollTo({ sectionIndex, itemIndex }), 0);
    hideLoading();
  }

  scrollTo = ({ sectionIndex = 0, itemIndex = 0 }) => {
    this.comic_list_ref && this.comic_list_ref.scrollToLocation({
      sectionIndex,
      itemIndex,
      viewPosition: 0,
      viewOffset: 150,
    });
  };

  _getRef = ref => this.comic_list_ref = ref;

  renderItem = ({ item }) => {
    const { chapter_id, isReplace, dark } = this.props;
    const itemOnPress = (params) => {
      if (isReplace) {
        Actions.drawerClose();
        // Actions.pop();
        Actions.replace('comicContent', params);
        Actions.refresh(params);
        // console.log(Actions);
      } else {
        Actions.comicContent(params);
      }
    };
    return (
      <ComicListItem
        {...item}
        dark={dark}
        itemOnPress={itemOnPress}
        active={item.id === chapter_id}
      />
    );
  };

  renderSectionHeader = ({ section }) => {
    const { dark } = this.props;
    return (
      <ComicListCategory dark={dark}>
        {section.name}
      </ComicListCategory>
    );
  };

  renderItemSeparator = () => {
    const { dark } = this.props;
    return <ItemSeparatorComponent style={dark && { borderBottomColor: '#fff' }} />;
  };

  render() {
    const { list, loading } = this.props;
    if (loading) return <Progress />;
    return (
      <SectionList
        ref={this._getRef}
        renderItem={this.renderItem}
        renderSectionHeader={this.renderSectionHeader}
        ItemSeparatorComponent={this.renderItemSeparator}
        stickySectionHeadersEnabled
        keyExtractor={_keyExtractor}
        initialNumToRender={initNumber}
        sections={list}
        getItemLayout={_getItemLayout}
      />
    );
  }
}

export default ComicListComponent;
