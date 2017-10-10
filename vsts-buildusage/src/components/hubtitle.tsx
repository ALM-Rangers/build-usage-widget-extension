// react imports
import * as React from "react";

import { PrimaryButton, CommandButton, IButtonProps } from "office-ui-fabric-react/lib-amd/Button";
import { DatePicker } from "office-ui-fabric-react/lib-amd/DatePicker";
import { Dropdown, DropdownMenuItemType, IDropdownOption } from "office-ui-fabric-react/lib-amd/DropDown";

interface IHubTitleProps extends React.Props<HubTitle> {
    // controls the diplay of datarange control
    showDateRange: boolean;
    onSelectStartDate: (date: Date) => void;
    onSelectFinishDate: (date: Date) => void;
    onExportToCSV: () => void;
    onFilterChange: (item: IDropdownOption) => void;
}

export class HubTitle extends React.Component<IHubTitleProps, any> {

    constructor(props) {
        super(props);
        this.state = {
            startDateValue: null,
            finishDateValue: null
        };
        this.clear = this.clear.bind(this);
        this.onSelectStartDate = this.onSelectStartDate.bind(this);
        this.onSelectFinishDate = this.onSelectFinishDate.bind(this);
    }

    clear() {
        this.setState({startDateValue: null, finishDateValue: null});
    }

    onSelectStartDate(date: Date) {
        this.setState({startDateValue: date});
        this.props.onSelectStartDate(date);
    }

    onSelectFinishDate(date: Date) {
        this.setState({finishDateValue: date});
        this.props.onSelectFinishDate(date);
    }

    render() {
       let dateRangeElement = null;
       if (this.props.showDateRange) {
       dateRangeElement = (
            <div id="date-range" className="build-filters">
                    <DatePicker className="build-filters" placeholder="From date" onSelectDate={this.onSelectStartDate} value={this.state.startDateValue} />
                    <DatePicker className="build-filters" placeholder="To date" onSelectDate={this.onSelectFinishDate} value={this.state.finishDateValue} />
                    <CommandButton className="build-filters" onClick={this.clear} iconProps={{ iconName: "Clear" }} text="Clear" />
                </div>
            );
        }

        return (
            <div className="title-region">
                <div className="title">
                    <h1 className="ms-font-l page-title">Build Usage</h1>
                </div>
                <div className="actions-region">
                    <div className="build-filters">
            <Dropdown
                className="build-filters"
                             id="period-dropdown"
                             defaultSelectedKey="ThisMonth"
                            onChanged={this.props.onFilterChange}
                        options={[{ key: "ThisMonth", text: "This month" },
                            { key: "LastMonth", text: "Last month" },
                            { key: "ThisYear", text: "This year" },
                            { key: "Custom", text: "Custom" }]} />
                    </div>
                    {dateRangeElement}
                    <PrimaryButton
                        className="build-filters"
                        onClick={this.props.onExportToCSV}
                        iconProps={{ iconName: "Download" }}
                        checked={true} text="Export" />
                </div>
            </div>
        );
    }
}