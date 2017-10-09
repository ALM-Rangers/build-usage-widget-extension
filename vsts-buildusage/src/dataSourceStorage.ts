
export class DataSourceStorage {

    public static getCurrentDataSource(): any[] {
        if (window["CurrentDataSource"] === undefined) {
            window["CurrentDataSource"] = null;
        }
        return window["CurrentDataSource"];
    }

    public static setCurrentDataSource( datasource: any[]) {
        window["CurrentDataSource"] = datasource;
    }
}