import client from 'apolloClient';
import gql from 'graphql-tag';
import EmptyState from 'modules/common/components/EmptyState';
import routerUtils from 'modules/common/utils/router';
import { mutations as notificationMutations } from 'modules/notifications/graphql';
import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import history from '../../../../browserHistory';
import {
  DropZone,
  EmptyContainer,
  ItemContainer,
  Wrapper
} from '../../styles/common';
import { IItem, IOptions } from '../../types';

type Props = {
  listId: string;
  stageId: string;
  items: IItem[];
  internalScroll?: boolean;
  style?: any;
  // may not be provided - and might be null
  ignoreContainerClipping?: boolean;
  options: IOptions;
};

type DraggableContainerProps = {
  stageId: string;
  item: IItem;
  index: number;
  options: IOptions;
};

class DraggableContainer extends React.Component<
  DraggableContainerProps,
  { isDragDisabled: boolean; hasNotified: boolean }
> {
  constructor(props: DraggableContainerProps) {
    super(props);

    this.state = {
      isDragDisabled: false,
      hasNotified: props.item.hasNotified === false ? false : true
    };
  }

  onItemClick = () => {
    const { item } = this.props;

    this.setState({ isDragDisabled: true }, () => {
      routerUtils.setParams(history, { itemId: item._id });
    });

    if (!this.state.hasNotified) {
      client.mutate({
        mutation: gql(notificationMutations.markAsRead),
        variables: {
          contentTypeId: item._id
        }
      });
    }
  };

  beforePopupClose = () => {
    this.setState({ isDragDisabled: false, hasNotified: true });
  };

  render() {
    const { stageId, item, index, options } = this.props;
    const { isDragDisabled } = this.state;
    const ItemComponent = options.Item;

    return (
      <Draggable
        key={item._id}
        draggableId={item._id}
        index={index}
        isDragDisabled={isDragDisabled}
      >
        {(dragProvided, dragSnapshot) => (
          <ItemContainer
            isDragging={dragSnapshot.isDragging}
            innerRef={dragProvided.innerRef}
            hasNotified={this.state.hasNotified}
            {...dragProvided.draggableProps}
            {...dragProvided.dragHandleProps}
          >
            <ItemComponent
              key={item._id}
              stageId={stageId}
              item={item}
              onClick={this.onItemClick}
              beforePopupClose={this.beforePopupClose}
              options={options}
            />
          </ItemContainer>
        )}
      </Draggable>
    );
  }
}

class InnerItemList extends React.PureComponent<{
  stageId: string;
  items: IItem[];
  options: IOptions;
}> {
  render() {
    const { stageId, items, options } = this.props;

    return items.map((item, index: number) => (
      <DraggableContainer
        key={item._id}
        stageId={stageId}
        item={item}
        index={index}
        options={options}
      />
    ));
  }
}

type InnerListProps = {
  dropProvided;
  stageId: string;
  items: IItem[];
  options: IOptions;
};

class InnerList extends React.PureComponent<InnerListProps> {
  render() {
    const { stageId, items, dropProvided, options } = this.props;

    if (items.length === 0) {
      return (
        <EmptyContainer innerRef={dropProvided.innerRef}>
          <EmptyState
            icon="clipboard"
            text={`No ${options.type}`}
            size="small"
          />
        </EmptyContainer>
      );
    }

    return (
      <DropZone innerRef={dropProvided.innerRef}>
        <InnerItemList stageId={stageId} items={items} options={options} />
        {dropProvided.placeholder}
      </DropZone>
    );
  }
}

export default class ItemList extends React.Component<Props> {
  static defaultProps = {
    listId: 'LIST'
  };

  render() {
    const {
      ignoreContainerClipping,
      listId,
      style,
      stageId,
      items,
      options
    } = this.props;

    return (
      <Droppable
        droppableId={listId}
        ignoreContainerClipping={ignoreContainerClipping}
      >
        {(dropProvided, dropSnapshot) => (
          <Wrapper
            style={style}
            isDraggingOver={dropSnapshot.isDraggingOver}
            {...dropProvided.droppableProps}
          >
            <InnerList
              stageId={stageId}
              items={items}
              dropProvided={dropProvided}
              options={options}
            />
            {dropProvided.placeholder}
          </Wrapper>
        )}
      </Droppable>
    );
  }
}
