// react imports
import * as React from "react";
import { DetailsList, IColumn, DetailsListLayoutMode, CheckboxVisibility } from "office-ui-fabric-react/lib-amd/DetailsList";

interface IGridProps extends React.Props<Grid> {
    sorteditems: any[];
    columns: any[];
    onItemInvoked?: (item: any ) => void;
    renderItemColumn?: (item: any, index: number, column: IColumn) => any;
}

export class Grid extends React.Component<IGridProps, any> {
    constructor(props) {
        super(props);
        this.state = {sortedItems: props.sorteditems, columns: props.columns};
        this.onColumnClick = this.onColumnClick.bind(this);
        this.onItemInvoked = this.onItemInvoked.bind(this);
        this.renderItemColumn = this.renderItemColumn.bind(this);
    }

    private componentWillReceiveProps(nextProps) {
        this.setState({
            sortedItems: nextProps.sorteditems,
            columns: nextProps.columns
        });
    }

    public onColumnClick(event: React.MouseEvent<HTMLElement>, column: IColumn) {
        let sortedItems = this.state.sortedItems;
        let columns = this.state.columns;
        let isSortedDescending = column.isSortedDescending;

        // If we've sorted this column, flip it.
        if (column.isSorted) {
            isSortedDescending = !isSortedDescending;
        }

        // Sort the items.
        sortedItems = sortedItems!.concat([]).sort((a, b) => {
            let firstValue = a[column.fieldName];
            let secondValue = b[column.fieldName];

            if (isSortedDescending) {
                return firstValue > secondValue ? -1 : 1;
            } else {
                return firstValue > secondValue ? 1 : -1;
            }
        });

        // Reset the items and columns to match the state.
        this.setState({
            sortedItems: sortedItems,
            columns: columns!.map(col => {
                col.isSorted = (col.key === column.key);

                if (col.isSorted) {
                    col.isSortedDescending = isSortedDescending;
                }
                return col;
            })
        });
    }

    public onItemInvoked(item: any) {
         if (this.props.onItemInvoked !== undefined) {
            this.props.onItemInvoked(item);
        }
    }

    public renderItemColumn(item: any, index: number, column: IColumn): any {
        if (this.props.renderItemColumn !== undefined) {
            return this.props.renderItemColumn(item, index, column);
        }
    }

    render() {
        let grid = <DetailsList
                        items={ this.state.sortedItems }
                        columns={ this.state.columns }
                        setKey="set"
                        layoutMode={ DetailsListLayoutMode.justified }
                        onColumnHeaderClick={this.onColumnClick}
                        isHeaderVisible={ true }
                        checkboxVisibility={CheckboxVisibility.hidden}
                        selectionPreservedOnEmptyClick={ true }
                        onItemInvoked={ this.onItemInvoked } />;

        if (this.props.renderItemColumn !== undefined) {
            grid = <DetailsList
                        items={ this.state.sortedItems }
                        columns={ this.state.columns }
                        setKey="set"
                        layoutMode={ DetailsListLayoutMode.justified }
                        onColumnHeaderClick={this.onColumnClick}
                        isHeaderVisible={ true }
                        selectionPreservedOnEmptyClick={ true }
                        checkboxVisibility={CheckboxVisibility.hidden}
                        onItemInvoked={ this.onItemInvoked }
                        onRenderItemColumn={ this.renderItemColumn } />;
        }
        return grid;
    }
}